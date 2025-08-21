import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 import navigate hook

const API_BASE = "http://localhost:5000";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // 👈 initialize navigate

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  // Remove item
  const handleRemove = async (id) => {
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const res = await axios.delete(`${API_BASE}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message || "Item removed from cart ✅");

      setCart((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Remove error:", err.response?.data || err.message);
      alert("Failed to remove item ❌");
    }
  };

  // Update quantity
  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(
        `${API_BASE}/api/cart/${id}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Update qty error:", err.response?.data || err.message);
    }
  };

  // Buy Now
  const handleBuyNow = async (item) => {
    try {
      await axios.post(
        `${API_BASE}/api/orders`,
        {
          items: [
            {
              productId: item.productId,
              quantity: item.quantity,
              collectionName: item.collectionName,
            },
          ],
          price: item.product?.price * item.quantity,
          totalPrice: item.product?.price + 40,
          shippingAddress: "Default address", // later replace with profile address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      fetchCart();
    } catch (err) {
      console.error("Buy now error:", err);
      alert("Failed to place order");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 border p-4 rounded shadow bg-white"
            >
              {/* 👇 clickable image */}
              <img
                src={item.product?.image_url}
                alt={item.product?.title}
                className="w-20 h-20 object-cover rounded cursor-pointer"
                onClick={() =>
                  navigate(`/product/${item.collectionName}/${item.productId}`)
                }
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.product?.title}</h2>
                <p>₹{item.product?.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBuyNow(item)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
