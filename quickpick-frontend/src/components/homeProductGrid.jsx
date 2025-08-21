import React from 'react';
import { Link } from 'react-router-dom';

const electronics = [
  { title: 'Monitors', price: '2000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817593/Monitor_ofmid9.png', collection:"monitors" },
  { title: 'Television', price: '5000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817599/Tv_c4rbr0.png', collection:"tv" },
  { title: 'Mobiles', price: '7000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817596/mobiles_mvsvdp.png', collection:"mobiles" },
  { title: 'Laptops', price: '10000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817596/laptops_p2uhie.png', collection:"laptops" },
];

const BestElectronics = () => {
  return (
    <div className=' px-8 py-8'>
    <div className="w-full bg-white shadow-md p-8 ">
      <h2 className="text-2xl font-semibold mb-6">Best Electronics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {electronics.map((item, i) => (
          <Link 
            key={i}
            to={`/products/${item.collection}`}
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="mx-auto h-40 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-700">From <span className="font-bold">₹{item.price}</span></p>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default BestElectronics;
