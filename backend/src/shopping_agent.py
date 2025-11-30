"""
E-commerce Shopping Assistant Agent.
Follows Agentic Commerce Protocol patterns for voice-driven shopping.
"""

import logging
from typing import Annotated
from livekit.agents import function_tool, RunContext
from livekit.agents.voice import Agent
from livekit.plugins import murf, google, deepgram, silero
import os
from dotenv import load_dotenv

from catalog import (
    list_products, get_product_by_id, create_order, get_last_order,
    add_to_cart, remove_from_cart, get_cart, clear_cart, checkout_cart,
    recommend_size, get_size_chart
)

logger = logging.getLogger("shopping-agent")
load_dotenv(".env.local")


class ShoppingAssistant(Agent):
    """E-commerce shopping assistant with cart and size recommendation features."""

    def __init__(self):
        super().__init__(
            instructions="""You are a friendly and helpful shopping assistant for Zudio online store.

**Your Role:**
- Help customers browse products
- Manage shopping cart (add, remove, view items)
- Provide size recommendations based on height
- Assist with checkout and orders

**Guidelines:**
1. **Be conversational** - Use simple, natural language for voice
2. **Suggest cart** - Recommend adding items to cart before checkout
3. **Ask for size help** - Offer size recommendations proactively
4. **Be clear about pricing** - Always mention prices in ₹ (Rupees)

**Product Categories (36 total items):**
- T-Shirts: 'tshirt' (6 items, ₹449-₹649)
- Hoodies: 'hoodie' (5 items, ₹1,799-₹2,199)
- Jeans: 'jeans' (5 items, ₹1,299-₹1,699)
- Shoes: 'shoes' (8 items, ₹999-₹2,199)
- Accessories: 'accessories' (6 items, ₹299-₹1,499)
- Winter: 'winter' - jackets, sweaters (6 items, ₹1,699-₹2,999)

**Shopping Flow:**
1. Browse → 2. Add to Cart → 3. View Cart → 4. Checkout

**Example Interactions:**
- "Show me shoes" → browse_products(category='shoes')
- "Show me accessories under 1000" → browse_products(category='accessories', max_price=1000)
- "Add the white sneakers to cart" → add_product_to_cart(product_id='shoes-001')
- "What's in my cart?" → view_shopping_cart()
- "I'm 5'10, what shoe size?" → get_size_recommendation(category='shoes', height_cm=178)
- "Checkout" → checkout_shopping_cart()

**Size Conversion:**
- 5'10" = 178cm, 6'0" = 183cm, 5'8" = 173cm, 5'6" = 168cm

**Important:**
- Keep responses concise for voice
- Proactively suggest cart over immediate purchase
- Offer size help when discussing clothing/shoes
- Accessories don't need size recommendations
""",
            stt=deepgram.STT(),
            llm=google.LLM(model="gemini-2.0-flash"),
            tts=murf.TTS(
                voice="en-US-cooper",
                api_key=os.getenv("MURF_API_KEY")
            ),
            vad=silero.VAD.load(),
        )
        self._last_shown_products = []

    @function_tool
    async def browse_products(
        self,
        context: RunContext,
        category: Annotated[str, "Category: 'tshirt', 'hoodie', 'jeans', 'shoes', 'accessories', or 'winter'"] = "",
        max_price: Annotated[int, "Max price (0=no limit)"] = 0,
        color: Annotated[str, "Color: 'black', 'white', 'blue', 'grey', 'brown', 'red'"] = "",
    ) -> str:
        """Browse products with filters."""
        filters = {}
        if category:
            filters["category"] = category
        if max_price > 0:
            filters["max_price"] = max_price
        if color:
            filters["color"] = color

        products = list_products(**filters)
        self._last_shown_products = products

        if not products:
            return "No products found. Try different filters?"

        result = f"Found {len(products)} item(s):\n\n"
        for i, p in enumerate(products, 1):
            result += f"{i}. {p['name']} - ₹{p['price']}\n"
            result += f"   {p['description']}\n\n"

        return result

    @function_tool
    async def add_product_to_cart(
        self,
        context: RunContext,
        product_id: Annotated[str, "Product ID like 'tshirt-001' or 'shoes-001'"],
        quantity: Annotated[int, "Quantity"] = 1,
    ) -> str:
        """Add product to cart."""
        try:
            result = add_to_cart(product_id, quantity)
            cart = result["cart"]
            return f"✓ Added to cart! ({cart['item_count']} items, ₹{cart['total']} total)"
        except Exception as e:
            return f"Couldn't add to cart: {str(e)}"

    @function_tool
    async def view_shopping_cart(self, context: RunContext) -> str:
        """Show cart contents."""
        cart = get_cart()
        
        if cart["item_count"] == 0:
            return "Cart is empty. Browse products to add items!"
        
        result = f"🛒 Cart ({cart['item_count']} items):\n\n"
        for item in cart["items"]:
            result += f"• {item['product_name']} x{item['quantity']} = ₹{item['price'] * item['quantity']}\n"
        result += f"\nTotal: ₹{cart['total']}\nSay 'checkout' to order!"
        
        return result

    @function_tool
    async def remove_from_shopping_cart(
        self,
        context: RunContext,
        product_id: Annotated[str, "Product ID to remove"],
    ) -> str:
        """Remove from cart."""
        result = remove_from_cart(product_id)
        cart = result["cart"]
        
        if result["status"] == "removed":
            return f"✓ Removed. Cart: {cart['item_count']} items, ₹{cart['total']}"
        return "Item not in cart."

    @function_tool
    async def checkout_shopping_cart(self, context: RunContext) -> str:
        """Checkout and place order."""
        try:
            order = checkout_cart()
            
            result = f"🎉 Order Placed!\n\nOrder ID: {order['id']}\n"
            for item in order['items']:
                result += f"• {item['product_name']} x{item['quantity']}\n"
            result += f"\nTotal: ₹{order['total']}\nThank you!"
            
            return result
        except Exception as e:
            return f"Checkout failed: {str(e)}"

    @function_tool
    async def get_size_recommendation(
        self,
        context: RunContext,
        category: Annotated[str, "Category: 'tshirt', 'hoodie', 'jeans', 'shoes', or 'winter'"],
        height_cm: Annotated[int, "Height in cm (e.g., 175)"],
    ) -> str:
        """Recommend size based on height."""
        rec = recommend_size(category, height_cm)
        
        if "error" in rec:
            return rec["error"]
        
        result = f"📏 Recommended Size: {rec['recommended_size']}\n"
        if "height_range" in rec:
            result += f"For height: {rec['height_range']}\n"
        if "note" in rec:
            result += f"Note: {rec['note']}\n"
        
        return result

    @function_tool
    async def get_product_id_by_position(
        self,
        context: RunContext,
        position: Annotated[int, "Position (1-indexed)"]
    ) -> str:
        """Get product ID by position in last shown list."""
        if not self._last_shown_products:
            return "No products shown recently."
        
        if position < 1 or position > len(self._last_shown_products):
            return f"Invalid position. Choose 1-{len(self._last_shown_products)}."
        
        return self._last_shown_products[position - 1]['id']

    async def on_enter(self, participant=None):
        """Greeting when agent joins."""
        await self.session.say(
            "Hi! Welcome to Zudio. I can help you browse clothes, shoes, accessories, "
            "manage your cart, and recommend sizes. What are you looking for today?",
            allow_interruptions=True
        )
