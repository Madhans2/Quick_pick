import React, { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/wishlist", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Wishlist data:", data);
        setWishlist(data);
      })
      .catch(err => console.error("Error fetching wishlist:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.productId || {};
            return (
              <div
                key={item._id}
                className="border rounded-lg shadow p-4 bg-white flex flex-col items-center"
              >
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.title || "Product"}
                  className="w-32 h-32 object-cover rounded"
                />
                <h2 className="mt-2 text-lg font-medium">
                  {product.title || "Unknown Product"}
                </h2>
                <p className="text-gray-600">₹{product.price || 0}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
