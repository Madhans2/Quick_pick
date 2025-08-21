import { useEffect, useState } from "react";
import image from "../assets/dp.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  // Fetch profile data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData(data);
      });
  }, []);

  // Handle form change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save updated profile to MongoDB
  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const updated = await res.json();
    setUser(updated);
    alert("Profile updated successfully!");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="px-4 sm:px-8 py-6 mt-6 mb-10 max-w-6xl mx-auto bg-[#f9fafb] rounded-2xl shadow-inner">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 bg-[#fef6e4] shadow-md rounded-2xl p-6 flex flex-col items-center">
          <img
            src={image}
            alt="Avatar"
            className="w-32 h-32 rounded-full mb-4 object-cover shadow-md"
          />
          <h2 className="text-lg font-bold mb-2 text-gray-800">{user.name}</h2>
          <ul className="w-full text-center space-y-2">
            <li className="py-2 hover:bg-[#fde68a] rounded cursor-pointer transition">
              Profile
            </li>
            <li className="py-2 hover:bg-[#fde68a] rounded cursor-pointer transition">
              Cart
            </li>
            <li className="py-2 hover:bg-[#fde68a] rounded cursor-pointer transition">
              Wishlist
            </li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-[#fff8f0] shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "username", "email", "mobile", "gender", "address"].map(
              (field) => (
                <div key={field} className="flex flex-col">
                  <label className="font-semibold capitalize mb-1 text-gray-700">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="border p-2 rounded bg-white shadow-sm"
                  />
                </div>
              )
            )}
          </div>
          <button
            onClick={handleSave}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
