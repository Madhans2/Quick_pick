import { useState } from 'react';
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBoxOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ad1 from '../assets/laptop.jpg';
import ad2 from '../assets/mobile.jpg';

const ads = [ad1, ad2];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAd, setCurrentAd] = useState(0);

  const handleNextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  const handlePrevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <div className="w-full">
      <div className="container flex  justify-between px-6 py-4 bg-white shadow-sm w-full">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">BuyIt</div>

        {/* Search Bar */}
        <div className="flex items-center w-1/2 bg-gray-100 rounded-md px-3 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products, brands and more"
            className="w-full bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-8 text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaUser className="text-lg" />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaHeart className="text-lg" />
            <span>Wishlist</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaShoppingCart className="text-lg" />
            <span>Cart</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaBoxOpen className="text-lg" />
            <span>Orders</span>
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="relative max-w-max h-96 overflow-hidden mt-8">
        <img src={ads[currentAd]} alt="Ad Banner" className="w-screen h-full object-cover" />
        <button
          onClick={handlePrevAd}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
        >
          <FaChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextAd}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
