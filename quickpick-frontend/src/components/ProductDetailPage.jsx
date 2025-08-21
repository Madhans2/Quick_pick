import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductDetailPage = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const token = localStorage.getItem("token");

  const API_BASE = "https://quick-pick-o9en.onrender.com";

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products/${category}/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [category, id]);

  // Fetch user address from profile
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserAddress(res.data.address || ""))
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [token]);

  // Add to cart
// Add to cart
const handleAddToCart = async () => {
  if (!token) {
    alert("Please log in to add products to cart.");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE}/api/cart`,
      {
        productId: product._id,
        quantity: 1,
        collectionName: category,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Product added to cart ✅");

    // Update stock instantly
    setProduct((prev) => ({ ...prev, stock: prev.stock - 1 }));
  } catch (err) {
    console.error("Add to cart error:", err.response?.data || err.message);
    alert("Failed to add product to cart. Please try again.");
  }
};

// Buy now
const handleBuyNow = async () => {
  if (!token) {
    alert("Please log in to buy products.");
    return;
  }
  if (!userAddress) {
    alert("Please update your address in Profile before buying.");
    return;
  }
  if (!product?._id || !product?.price) {
    alert("Invalid product. Cannot buy.");
    return;
  }

  try {
    await axios.post(
      `${API_BASE}/api/orders`,
      {
        items: [{ productId: product._id, quantity: 1, collectionName: category }],
        totalPrice: product.price,
        shippingAddress: userAddress,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Order placed successfully ✅");

    // Update stock instantly
    setProduct((prev) => ({ ...prev, stock: prev.stock - 1 }));
  } catch (err) {
    console.error("Buy Now error:", err.response?.data || err.message);
    alert("Failed to place order. Please try again.");
  }
};


  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-[#E6C989] min-h-screen p-6">
      <div className="bg-[#fff8f0] rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image Section */}
        <div className="flex flex-col items-center">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full max-w-md object-contain rounded-xl border"
          />
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg shadow-md font-medium transition"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md font-medium transition"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">
            <strong>Brand:</strong> {product.brand}
          </p>
          <p className="text-green-700 font-semibold mt-2">{product.offer || "Special Offer"}</p>
          <p className="text-3xl font-bold text-black mt-2">₹{product.price}</p>
          <span className="bg-green-100 text-green-800 font-medium inline-block px-3 py-1 rounded-full mt-2">
            ⭐ {product.rating} / 5
          </span>
          <p className="mt-3 text-gray-700">
            <strong>Available Qty:</strong> {product.stock || 20}
          </p>

          <hr className="my-6" />

          <div>
            <h3 className="text-xl font-bold mb-2">Product Details</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.features?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
