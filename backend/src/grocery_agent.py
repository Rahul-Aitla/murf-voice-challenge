import json
import logging
import os
from pathlib import Path
from typing import Annotated, List, Dict, Any
from datetime import datetime

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import (
    WorkerOptions, 
    cli, 
    AutoSubscribe, 
    JobContext, 
    JobProcess,
    function_tool,
    RunContext
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import murf, google, deepgram, silero

logger = logging.getLogger("grocery-agent")
logger.setLevel(logging.INFO)

load_dotenv(".env.local")

CATALOG_PATH = Path("grocery_catalog.json")
ORDER_OUTPUT_PATH = Path("orders.json")

# Simple recipe mapping for "ingredients for X"
RECIPES = {
    "sandwich": ["Britannia Whole Wheat Bread", "Amul Butter"],
    "peanut butter sandwich": ["Britannia Whole Wheat Bread", "Pintola Peanut Butter"],
    "pb&j": ["Britannia Whole Wheat Bread", "Pintola Peanut Butter", "Kissan Mixed Fruit Jam"],
    "pasta": ["Bambino Macaroni", "Smith & Jones Pasta Masala"],
    "maggi": ["Maggi Noodles"],
    "tea": ["Tata Tea Gold", "Amul Taaza Milk", "Madhur Sugar"],
    "chai": ["Tata Tea Gold", "Amul Taaza Milk", "Madhur Sugar"],
    "dal chawal": ["Tata Sampann Toor Dal", "Daawat Basmati Rice", "Tata Salt"],
    "breakfast": ["Britannia Whole Wheat Bread", "Amul Butter", "Amul Taaza Milk", "Tata Tea Gold"],
}

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

class GroceryAgent(Agent):
    def __init__(self, voice_id="anusha", language="en-US"):
        super().__init__(
            instructions="""You are a friendly Grocery Ordering Assistant for 'FreshMart India'.
Your goal is to help customers order food and groceries.

**Capabilities:**
1.  **Browse Catalog:** You know about groceries, snacks, and prepared foods (Indian brands).
2.  **Manage Cart:** You can add items, remove items, and update quantities.
3.  **Smart Ingredients:** If a user asks for ingredients for a dish (e.g., "pasta", "sandwich", "chai", "dal chawal"), use the `add_ingredients_for_dish` tool to add all necessary items.
4.  **Checkout:** When the user is done, use the `place_order` tool to save the order.

**Conversation Flow:**
1.  **Greet:** Welcome the user to FreshMart and ask how you can help.
2.  **Assist:**
    *   If they ask for an item, use `add_to_cart`.
    *   If they ask for ingredients/recipe, use `add_ingredients_for_dish`.
    *   If they ask what's in the cart, use `view_cart`.
    *   If they want to remove something, use `remove_from_cart`.
3.  **Confirm:** Always verbally confirm what you've added or removed (e.g., "I've added 2 packets of Maggi to your cart.").
4.  **Checkout:**
    *   When the user says "I'm done" or "Place order", review the cart total.
    *   Ask for a name for the order if you don't have it (optional, but good for the record).
    *   Call `place_order`.
    *   Thank the user and end the conversation.

**Tone:**
Friendly, helpful, and efficient.
""",
            stt=deepgram.STT(language=language),
            llm=google.LLM(
                model="gemini-2.0-flash",
            ),
            tts=murf.TTS(
                voice=voice_id,
                api_key=os.getenv("MURF_API_KEY")
            ),
            vad=silero.VAD.load(),
        )
        self.cart: List[Dict[str, Any]] = []
        self.catalog: List[Dict[str, Any]] = []
        self.load_catalog()

    def load_catalog(self):
        try:
            if CATALOG_PATH.exists():
                with open(CATALOG_PATH, "r") as f:
                    self.catalog = json.load(f)
                logger.info(f"Loaded {len(self.catalog)} items from catalog.")
            else:
                logger.error("Catalog file not found!")
        except Exception as e:
            logger.error(f"Error loading catalog: {e}")

    def find_item_in_catalog(self, item_name: str):
        """Fuzzy search for an item in the catalog."""
        item_name = item_name.lower()
        # Exact match first
        for item in self.catalog:
            if item["name"].lower() == item_name:
                return item
        # Partial match
        for item in self.catalog:
            if item_name in item["name"].lower():
                return item
        return None

    @function_tool
    async def add_to_cart(
        self, 
        context: RunContext, 
        item_name: Annotated[str, "The name of the item to add"], 
        quantity: Annotated[int, "The quantity to add"] = 1,
        notes: Annotated[str, "Any special notes (e.g., brand preference)"] = ""
    ):
        """Add a specific item to the cart."""
        item = self.find_item_in_catalog(item_name)
        if not item:
            return f"Sorry, I couldn't find '{item_name}' in our catalog."
        
        # Check if already in cart
        for cart_item in self.cart:
            if cart_item["id"] == item["id"]:
                cart_item["quantity"] += quantity
                if notes:
                    cart_item["notes"] = notes
                return f"Updated {item['name']} quantity to {cart_item['quantity']}."
        
        # Add new item
        self.cart.append({
            "id": item["id"],
            "name": item["name"],
            "price": item["price"],
            "quantity": quantity,
            "notes": notes
        })
        return f"Added {quantity} {item['name']} to your cart."

    @function_tool
    async def remove_from_cart(
        self, 
        context: RunContext, 
        item_name: Annotated[str, "The name of the item to remove"]
    ):
        """Remove an item from the cart."""
        item_name = item_name.lower()
        for i, cart_item in enumerate(self.cart):
            if item_name in cart_item["name"].lower():
                removed = self.cart.pop(i)
                return f"Removed {removed['name']} from your cart."
        return f"Could not find '{item_name}' in your cart."

    @function_tool
    async def view_cart(self, context: RunContext):
        """List all items currently in the cart and the total price."""
        if not self.cart:
            return "Your cart is empty."
        
        summary = "Here's what's in your cart:\n"
        total = 0.0
        for item in self.cart:
            subtotal = item["price"] * item["quantity"]
            total += subtotal
            summary += f"- {item['quantity']}x {item['name']} (₹{subtotal:.2f})\n"
        
        summary += f"\nTotal: ₹{total:.2f}"
        return summary

    @function_tool
    async def add_ingredients_for_dish(
        self, 
        context: RunContext, 
        dish_name: Annotated[str, "The name of the dish (e.g., 'pasta', 'sandwich')"]
    ):
        """Add all ingredients for a known dish/recipe to the cart."""
        dish_key = dish_name.lower()
        ingredients = None
        
        # Simple lookup
        for key, items in RECIPES.items():
            if key in dish_key:
                ingredients = items
                break
        
        if not ingredients:
            return f"I don't have a pre-set recipe for '{dish_name}'. Please add items individually."
        
        added_items = []
        for ing_name in ingredients:
            item = self.find_item_in_catalog(ing_name)
            if item:
                # Add to cart logic (simplified duplication of add_to_cart)
                found = False
                for cart_item in self.cart:
                    if cart_item["id"] == item["id"]:
                        cart_item["quantity"] += 1
                        found = True
                        break
                if not found:
                    self.cart.append({
                        "id": item["id"],
                        "name": item["name"],
                        "price": item["price"],
                        "quantity": 1,
                        "notes": "Added via recipe"
                    })
                added_items.append(item["name"])
        
        if added_items:
            return f"Added ingredients for {dish_name}: {', '.join(added_items)}."
        else:
            return f"Could not find ingredients for {dish_name} in the catalog."

    @function_tool
    async def place_order(
        self, 
        context: RunContext, 
        customer_name: Annotated[str, "The customer's name"] = "Guest"
    ):
        """Finalize the order and save it to a file."""
        if not self.cart:
            return "Your cart is empty. Cannot place an order."
        
        total = sum(item["price"] * item["quantity"] for item in self.cart)
        
        order = {
            "order_id": f"ORD-{int(datetime.now().timestamp())}",
            "customer_name": customer_name,
            "timestamp": datetime.now().isoformat(),
            "items": self.cart,
            "total_amount": total,
            "status": "placed"
        }
        
        try:
            # Append to orders.json or create list
            orders = []
            if ORDER_OUTPUT_PATH.exists():
                try:
                    with open(ORDER_OUTPUT_PATH, "r") as f:
                        content = f.read()
                        if content:
                            orders = json.loads(content)
                            if not isinstance(orders, list):
                                orders = [orders]
                except json.JSONDecodeError:
                    pass # Start fresh if corrupt
            
            orders.append(order)
            
            with open(ORDER_OUTPUT_PATH, "w") as f:
                json.dump(orders, f, indent=2)
            
            # Clear cart
            self.cart = []
            return f"Order placed successfully! Order ID: {order['order_id']}. Total: ₹{total:.2f}."
        except Exception as e:
            logger.error(f"Error saving order: {e}")
            return "There was an error saving your order. Please try again."

    async def on_enter(self, participant=None):
        await self.session.say("Welcome to Zomato! I'm your grocery assistant. How can I help you today?", allow_interruptions=True)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()
    logger.info(f"starting grocery agent for participant {participant.identity}")

    voice_id = "en-US-cooper"
    language = "en-US"
    
    if participant.metadata:
        try:
            import json
            meta = json.loads(participant.metadata)
            if meta.get("voiceId"):
                voice_id = meta["voiceId"]
            if meta.get("language"):
                language = meta["language"]
                logger.info(f"Using voice: {voice_id}, language: {language}")
        except Exception as e:
            logger.warning(f"Error parsing metadata: {e}")

    session = AgentSession()
    
    await session.start(
        agent=GroceryAgent(voice_id=voice_id, language=language),
        room=ctx.room,
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
