from datetime import datetime
from typing import Optional

PRODUCTS = [
    # T-Shirts (6 items)
    {
        "id": "tshirt-001",
        "name": "Classic Black T-Shirt",
        "description": "Premium 100% cotton black t-shirt, perfect for everyday wear",
        "price": 499,
        "currency": "INR",
        "category": "tshirt",
        "color": "black",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "tshirt-002",
        "name": "White Cotton T-Shirt",
        "description": "Comfortable white cotton t-shirt, wardrobe essential",
        "price": 449,
        "currency": "INR",
        "category": "tshirt",
        "color": "white",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "tshirt-003",
        "name": "Navy Blue T-Shirt",
        "description": "Stylish navy blue t-shirt with modern fit",
        "price": 549,
        "currency": "INR",
        "category": "tshirt",
        "color": "blue",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "tshirt-004",
        "name": "Olive Green T-Shirt",
        "description": "Trendy olive green t-shirt, perfect for casual outings",
        "price": 499,
        "currency": "INR",
        "category": "tshirt",
        "color": "green",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "tshirt-005",
        "name": "Striped T-Shirt",
        "description": "Classic navy and white striped t-shirt",
        "price": 599,
        "currency": "INR",
        "category": "tshirt",
        "color": "blue",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "tshirt-006",
        "name": "Graphic Print T-Shirt",
        "description": "Cool graphic print t-shirt with modern design",
        "price": 649,
        "currency": "INR",
        "category": "tshirt",
        "color": "black",
        "size": "L",
        "in_stock": True
    },
    
    # Hoodies (5 items)
    {
        "id": "hoodie-001",
        "name": "Black Oversized Hoodie",
        "description": "Trendy oversized black hoodie with front pocket",
        "price": 1899,
        "currency": "INR",
        "category": "hoodie",
        "color": "black",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "hoodie-002",
        "name": "Grey Pullover Hoodie",
        "description": "Comfortable grey hoodie, perfect for winter",
        "price": 1799,
        "currency": "INR",
        "category": "hoodie",
        "color": "grey",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "hoodie-003",
        "name": "Maroon Zip Hoodie",
        "description": "Stylish maroon zip-up hoodie with fleece lining",
        "price": 2199,
        "currency": "INR",
        "category": "hoodie",
        "color": "maroon",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "hoodie-004",
        "name": "Navy Blue Hoodie",
        "description": "Classic navy blue hoodie with kangaroo pocket",
        "price": 1849,
        "currency": "INR",
        "category": "hoodie",
        "color": "blue",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "hoodie-005",
        "name": "Beige Hoodie",
        "description": "Minimalist beige hoodie, perfect for layering",
        "price": 1899,
        "currency": "INR",
        "category": "hoodie",
        "color": "beige",
        "size": "M",
        "in_stock": True
    },
    
    # Jeans (5 items)
    {
        "id": "jeans-001",
        "name": "Black Slim Fit Jeans",
        "description": "Classic black slim fit jeans with stretch",
        "price": 1499,
        "currency": "INR",
        "category": "jeans",
        "color": "black",
        "size": "32",
        "in_stock": True
    },
    {
        "id": "jeans-002",
        "name": "Blue Denim Jeans",
        "description": "Traditional blue denim jeans, regular fit",
        "price": 1299,
        "currency": "INR",
        "category": "jeans",
        "color": "blue",
        "size": "34",
        "in_stock": True
    },
    {
        "id": "jeans-003",
        "name": "Dark Grey Jeans",
        "description": "Modern dark grey jeans with tapered fit",
        "price": 1599,
        "currency": "INR",
        "category": "jeans",
        "color": "grey",
        "size": "32",
        "in_stock": True
    },
    {
        "id": "jeans-004",
        "name": "Light Blue Jeans",
        "description": "Casual light blue denim jeans, relaxed fit",
        "price": 1399,
        "currency": "INR",
        "category": "jeans",
        "color": "blue",
        "size": "34",
        "in_stock": True
    },
    {
        "id": "jeans-005",
        "name": "Black Ripped Jeans",
        "description": "Trendy black ripped jeans with distressed look",
        "price": 1699,
        "currency": "INR",
        "category": "jeans",
        "color": "black",
        "size": "32",
        "in_stock": True
    },
    
    # Shoes (8 items)
    {
        "id": "shoes-001",
        "name": "White Sneakers",
        "description": "Classic white sneakers, comfortable for all-day wear",
        "price": 1299,
        "currency": "INR",
        "category": "shoes",
        "color": "white",
        "size": "9",
        "in_stock": True
    },
    {
        "id": "shoes-002",
        "name": "Black Running Shoes",
        "description": "Lightweight black running shoes with cushioned sole",
        "price": 1599,
        "currency": "INR",
        "category": "shoes",
        "color": "black",
        "size": "10",
        "in_stock": True
    },
    {
        "id": "shoes-003",
        "name": "Brown Casual Shoes",
        "description": "Stylish brown casual shoes for everyday wear",
        "price": 1799,
        "currency": "INR",
        "category": "shoes",
        "color": "brown",
        "size": "9",
        "in_stock": True
    },
    {
        "id": "shoes-004",
        "name": "Navy Blue Canvas Shoes",
        "description": "Comfortable navy blue canvas shoes",
        "price": 999,
        "currency": "INR",
        "category": "shoes",
        "color": "blue",
        "size": "8",
        "in_stock": True
    },
    {
        "id": "shoes-005",
        "name": "Grey Sports Shoes",
        "description": "Performance grey sports shoes with breathable mesh",
        "price": 1899,
        "currency": "INR",
        "category": "shoes",
        "color": "grey",
        "size": "10",
        "in_stock": True
    },
    {
        "id": "shoes-006",
        "name": "Black Formal Shoes",
        "description": "Elegant black formal shoes for office wear",
        "price": 2199,
        "currency": "INR",
        "category": "shoes",
        "color": "black",
        "size": "9",
        "in_stock": True
    },
    {
        "id": "shoes-007",
        "name": "Tan Loafers",
        "description": "Comfortable tan loafers, perfect for casual occasions",
        "price": 1699,
        "currency": "INR",
        "category": "shoes",
        "color": "brown",
        "size": "9",
        "in_stock": True
    },
    {
        "id": "shoes-008",
        "name": "Red Sneakers",
        "description": "Bold red sneakers for a sporty look",
        "price": 1499,
        "currency": "INR",
        "category": "shoes",
        "color": "red",
        "size": "10",
        "in_stock": True
    },
    
    # Accessories (6 items)
    {
        "id": "acc-001",
        "name": "Black Leather Belt",
        "description": "Classic black leather belt with silver buckle",
        "price": 599,
        "currency": "INR",
        "category": "accessories",
        "color": "black",
        "size": "Free",
        "in_stock": True
    },
    {
        "id": "acc-002",
        "name": "Brown Leather Wallet",
        "description": "Premium brown leather wallet with multiple card slots",
        "price": 799,
        "currency": "INR",
        "category": "accessories",
        "color": "brown",
        "size": "Free",
        "in_stock": True
    },
    {
        "id": "acc-003",
        "name": "Black Cap",
        "description": "Stylish black baseball cap with adjustable strap",
        "price": 399,
        "currency": "INR",
        "category": "accessories",
        "color": "black",
        "size": "Free",
        "in_stock": True
    },
    {
        "id": "acc-004",
        "name": "Grey Backpack",
        "description": "Spacious grey backpack with laptop compartment",
        "price": 1499,
        "currency": "INR",
        "category": "accessories",
        "color": "grey",
        "size": "Free",
        "in_stock": True
    },
    {
        "id": "acc-005",
        "name": "Aviator Sunglasses",
        "description": "Classic aviator sunglasses with UV protection",
        "price": 899,
        "currency": "INR",
        "category": "accessories",
        "color": "black",
        "size": "Free",
        "in_stock": True
    },
    {
        "id": "acc-006",
        "name": "White Socks Pack",
        "description": "Pack of 3 comfortable white cotton socks",
        "price": 299,
        "currency": "INR",
        "category": "accessories",
        "color": "white",
        "size": "Free",
        "in_stock": True
    },
    
    # Winter Collection (6 items)
    {
        "id": "jacket-001",
        "name": "Puffer Jacket Black",
        "description": "Warm puffer jacket for cold weather",
        "price": 2999,
        "currency": "INR",
        "category": "winter",
        "color": "black",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "jacket-002",
        "name": "Denim Jacket Blue",
        "description": "Classic blue denim jacket, winter essential",
        "price": 2499,
        "currency": "INR",
        "category": "winter",
        "color": "blue",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "sweater-001",
        "name": "Wool Sweater Grey",
        "description": "Cozy grey wool sweater for winter",
        "price": 1899,
        "currency": "INR",
        "category": "winter",
        "color": "grey",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "sweater-002",
        "name": "Cardigan Beige",
        "description": "Comfortable beige cardigan, perfect layering piece",
        "price": 1699,
        "currency": "INR",
        "category": "winter",
        "color": "beige",
        "size": "M",
        "in_stock": True
    },
    {
        "id": "jacket-003",
        "name": "Bomber Jacket Olive",
        "description": "Trendy olive green bomber jacket",
        "price": 2799,
        "currency": "INR",
        "category": "winter",
        "color": "green",
        "size": "L",
        "in_stock": True
    },
    {
        "id": "sweater-003",
        "name": "Turtleneck Sweater Black",
        "description": "Stylish black turtleneck sweater",
        "price": 1999,
        "currency": "INR",
        "category": "winter",
        "color": "black",
        "size": "M",
        "in_stock": True
    },
]

# In-memory order storage
ORDERS = []

# In-memory shopping cart (one cart per session for simplicity)
CART = []

# Size recommendations based on height (in cm)
SIZE_CHART = {
    "tshirt": {
        "S": {"height_min": 150, "height_max": 165, "chest": "36-38"},
        "M": {"height_min": 165, "height_max": 175, "chest": "38-40"},
        "L": {"height_min": 175, "height_max": 185, "chest": "40-42"},
        "XL": {"height_min": 185, "height_max": 195, "chest": "42-44"},
    },
    "hoodie": {
        "S": {"height_min": 150, "height_max": 165, "chest": "36-38"},
        "M": {"height_min": 165, "height_max": 175, "chest": "38-40"},
        "L": {"height_min": 175, "height_max": 185, "chest": "40-42"},
        "XL": {"height_min": 185, "height_max": 195, "chest": "42-44"},
    },
    "jeans": {
        "28": {"height_min": 150, "height_max": 160, "waist": "28"},
        "30": {"height_min": 160, "height_max": 170, "waist": "30"},
        "32": {"height_min": 170, "height_max": 180, "waist": "32"},
        "34": {"height_min": 180, "height_max": 190, "waist": "34"},
        "36": {"height_min": 190, "height_max": 200, "waist": "36"},
    },
    "shoes": {
        "7": {"height_min": 150, "height_max": 165, "foot_length": "24-25cm"},
        "8": {"height_min": 160, "height_max": 170, "foot_length": "25-26cm"},
        "9": {"height_min": 170, "height_max": 180, "foot_length": "26-27cm"},
        "10": {"height_min": 180, "height_max": 190, "foot_length": "27-28cm"},
        "11": {"height_min": 190, "height_max": 200, "foot_length": "28-29cm"},
    },
    "winter": {
        "S": {"height_min": 150, "height_max": 165, "chest": "36-38"},
        "M": {"height_min": 165, "height_max": 175, "chest": "38-40"},
        "L": {"height_min": 175, "height_max": 185, "chest": "40-42"},
        "XL": {"height_min": 185, "height_max": 195, "chest": "42-44"},
    },
}


def list_products(
    category: Optional[str] = None,
    max_price: Optional[int] = None,
    color: Optional[str] = None,
    min_price: Optional[int] = None
) -> list[dict]:
    """
    List products with optional filters.
    
    Args:
        category: Filter by category (e.g., 'mug', 'clothing')
        max_price: Maximum price in INR
        color: Filter by color
        min_price: Minimum price in INR
    
    Returns:
        List of product dictionaries matching the filters
    """
    filtered = PRODUCTS.copy()
    
    if category:
        filtered = [p for p in filtered if p.get("category", "").lower() == category.lower()]
    
    if max_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) <= max_price]
    
    if min_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) >= min_price]
    
    if color:
        filtered = [p for p in filtered if p.get("color", "").lower() == color.lower()]
    
    return filtered


def get_product_by_id(product_id: str) -> Optional[dict]:
    """Get a single product by ID."""
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def create_order(line_items: list[dict]) -> dict:
    """
    Create a new order.
    
    Args:
        line_items: List of items, each with 'product_id' and 'quantity'
                   Example: [{"product_id": "mug-001", "quantity": 2}]
    
    Returns:
        Order dictionary with id, items, total, currency, and timestamp
    """
    # Use timestamp-based order ID for better uniqueness
    timestamp = datetime.now()
    order_id = f"ORD-{timestamp.strftime('%Y%m%d')}-{len(ORDERS) + 1:04d}"
    order_items = []
    total = 0
    currency = "INR"
    
    for item in line_items:
        product = get_product_by_id(item["product_id"])
        if not product:
            raise ValueError(f"Product {item['product_id']} not found")
        
        quantity = item.get("quantity", 1)
        item_total = product["price"] * quantity
        total += item_total
        
        order_items.append({
            "product_id": product["id"],
            "product_name": product["name"],
            "quantity": quantity,
            "unit_price": product["price"],
            "item_total": item_total
        })
    
    order = {
        "id": order_id,
        "items": order_items,
        "total": total,
        "currency": currency,
        "created_at": timestamp.isoformat(),
        "status": "confirmed"
    }
    
    ORDERS.append(order)
    return order



def get_last_order() -> Optional[dict]:
    """Get the most recent order."""
    if ORDERS:
        return ORDERS[-1]
    return None


def get_all_orders() -> list[dict]:
    """Get all orders."""
    return ORDERS.copy()


# ============ SHOPPING CART FUNCTIONS ============

def add_to_cart(product_id: str, quantity: int = 1) -> dict:
    """Add a product to the shopping cart."""
    product = get_product_by_id(product_id)
    if not product:
        raise ValueError(f"Product {product_id} not found")
    
    # Check if product already in cart
    for item in CART:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            return {"status": "updated", "cart": get_cart()}
    
    # Add new item to cart
    CART.append({
        "product_id": product_id,
        "product_name": product["name"],
        "price": product["price"],
        "quantity": quantity,
        "image": f"/products/{product_id.replace('-', '-')}.jpg"  # Placeholder
    })
    
    return {"status": "added", "cart": get_cart()}


def remove_from_cart(product_id: str) -> dict:
    """Remove a product from the cart."""
    global CART
    initial_length = len(CART)
    CART = [item for item in CART if item["product_id"] != product_id]
    
    if len(CART) < initial_length:
        return {"status": "removed", "cart": get_cart()}
    else:
        return {"status": "not_found", "cart": get_cart()}


def update_cart_quantity(product_id: str, quantity: int) -> dict:
    """Update quantity of a product in cart."""
    for item in CART:
        if item["product_id"] == product_id:
            if quantity <= 0:
                return remove_from_cart(product_id)
            item["quantity"] = quantity
            return {"status": "updated", "cart": get_cart()}
    
    return {"status": "not_found", "cart": get_cart()}


def get_cart() -> dict:
    """Get current cart contents with total."""
    total = sum(item["price"] * item["quantity"] for item in CART)
    return {
        "items": CART.copy(),
        "total": total,
        "currency": "INR",
        "item_count": len(CART)
    }


def clear_cart() -> dict:
    """Clear all items from cart."""
    global CART
    CART = []
    return {"status": "cleared", "cart": get_cart()}


def checkout_cart() -> dict:
    """Convert cart to order and clear cart."""
    if not CART:
        raise ValueError("Cart is empty")
    
    line_items = [{"product_id": item["product_id"], "quantity": item["quantity"]} for item in CART]
    order = create_order(line_items)
    clear_cart()
    
    return order


# ============ SIZE RECOMMENDATION FUNCTIONS ============

def recommend_size(category: str, height_cm: int) -> dict:
    """
    Recommend size based on height.
    
    Args:
        category: Product category (tshirt, hoodie, jeans, winter)
        height_cm: User's height in centimeters
    
    Returns:
        Dictionary with recommended size and details
    """
    if category not in SIZE_CHART:
        return {"error": f"No size chart available for category: {category}"}
    
    chart = SIZE_CHART[category]
    
    for size, measurements in chart.items():
        if measurements["height_min"] <= height_cm <= measurements["height_max"]:
            return {
                "recommended_size": size,
                "category": category,
                "height_range": f"{measurements['height_min']}-{measurements['height_max']} cm",
                "measurements": measurements
            }
    
    # If height is outside range, recommend closest
    if height_cm < 150:
        return {
            "recommended_size": list(chart.keys())[0],
            "category": category,
            "note": "Below standard range, smallest size recommended"
        }
    else:
        return {
            "recommended_size": list(chart.keys())[-1],
            "category": category,
            "note": "Above standard range, largest size recommended"
        }


def get_size_chart(category: str) -> dict:
    """Get full size chart for a category."""
    if category not in SIZE_CHART:
        return {"error": f"No size chart available for category: {category}"}
    
    return {
        "category": category,
        "sizes": SIZE_CHART[category]
    }
