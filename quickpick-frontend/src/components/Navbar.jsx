// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBoxOpen,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user JSON", e);
        localStorage.removeItem("user");
      }
    }

    if (!token) return;

    // Optional: fetch latest profile from backend
    fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <div className="bg-white shadow-md w-full">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-4 py-3 md:px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Quick Pick
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-1/2 bg-gray-100 rounded-md px-3 py-2"
        >
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products, brands and more"
            className="w-full bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          {!user ? (
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <FaUser className="text-lg" />
              <span>Login</span>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <FaUser className="text-lg" />
                 <span>{user.username || user.name || "Profile"}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to="/wishlist" className="flex items-center space-x-1 cursor-pointer">
            <FaHeart className="text-lg" />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="flex items-center space-x-1 cursor-pointer">
            <FaShoppingCart className="text-lg" />
            <span>Cart</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-1 cursor-pointer">
            <FaBoxOpen className="text-lg" />
            <span>Orders</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-100 rounded-md px-3 py-2"
        >
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3">
          {!user ? (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              <FaUser />
              <span>Login</span>
            </div>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2"
              >
                <FaUser />
                 <span>{user.username || user.name || "Profile"}</span>
              </Link>
              <button
                className="flex items-center space-x-2 text-red-600"
                onClick={handleLogout}
              >
                <FaTimes />
                <span>Logout</span>
              </button>
            </>
          )}
          <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2">
            <FaHeart />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2">
            <FaShoppingCart />
            <span>Cart</span>
          </Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2">
            <FaBoxOpen />
            <span>Orders</span>
          </Link>
        </div>
      )}
    </div>
  );
}
