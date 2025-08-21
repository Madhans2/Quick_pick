import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Store profile details
  const [profile, setProfile] = useState({
    address: "",
    mobile: "",
  });

  useEffect(() => {
    const fetchOrdersAndProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch profile first (to get address, mobile, username)
        const profileRes = await fetch("https://quick-pick-o9en.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setProfile({
          address: profileData.address || "Not provided",
          mobile: profileData.mobile || "Not provided",
          username: profileData.username || "Not provided",
        });

        // ✅ Fetch orders
        const res = await fetch("https://quick-pick-o9en.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = await res.json();

        // Attach product details for each item
        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productRes = await fetch(
                    `https://quick-pick-o9en.onrender.com/api/products/${item.collectionName}/${item.productId}`
                  );
                  const productData = await productRes.json();
                  return { ...item, product: productData };
                } catch (err) {
                  console.error("Error fetching product:", err);
                  return { ...item, product: null };
                }
              })
            );
            return { ...order, items: updatedItems };
          })
        );

        setOrders(ordersWithProducts);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProfile();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-white shadow rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                  <p className="text-sm text-gray-500">Status: {order.status}</p>
                </div>
                <p className="text-green-600 font-bold text-lg">
                  ₹{order.totalPrice.toLocaleString()}
                </p>
              </div>

              {order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-t pt-4"
                  >
                    <img
                      src={item.product?.image_url || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-md font-medium">
                        {item.product?.title || "Unknown Product"}
                      </h3>
                      <p className="text-gray-600">
                        ₹{item.product?.price?.toLocaleString() || 0}
                      </p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-gray-500">
                        Category: {item.product?.category?.main || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No items in this order.</p>
              )}

              {/* ✅ Show profile details here */}
              <div className="pt-4 text-sm text-gray-600 border-t space-y-1">
                <p>Shipping Address: {profile.address}</p>
                <p>Mobile: {profile.mobile}</p>
                <p>Delivary Charge : 40 added to Price</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
