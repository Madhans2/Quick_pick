import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ad1 from '../assets/laptop.jpg';
import ad2 from '../assets/mobile.jpg';

const ads = [ad1, ad2];

export default function Ads() {
  const [currentAd, setCurrentAd] = useState(0);

  const handleNextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  const handlePrevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <div className="pt-16">
      {/* Ad Banner */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden px-2 sm:px-6">
        <img
          src={ads[currentAd]}
          alt="Ad Banner"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Prev Button */}
        <button
          onClick={handlePrevAd}
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70"
        >
          <FaChevronLeft size={16} className="sm:size-5" />
        </button>
        {/* Next Button */}
        <button
          onClick={handleNextAd}
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70"
        >
          <FaChevronRight size={16} className="sm:size-5" />
        </button>
      </div>
    </div>
  );
}
