import React from 'react';
import { Link } from 'react-router-dom';

const toysBeauty = [
  { title: 'Plastic Toys', price: '90', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817592/plasticToys_sxsi8l.png', collection:"plastic_toys" },
  { title: 'Remote Cars', price: '300', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817592/remoteCar_aengtf.png', collection:"remote_cars" },
  { title: 'Stationaries', price: '10', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817593/stationary_qdfuy2.png', collection:"stationaries" },
  { title: "Teddy's", price: '200', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817591/teddy_ffeop6.png', collection:"teddy" },
];
const ToysBeauty = () => {
  return (
    <div className='px-8 py-8'>
    <div className="w-full bg-white shadow-md p-8 my-8">
      <h2 className="text-2xl font-semibold mb-6">Toys & Beauty</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {toysBeauty.map((item, i) => (
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

export default ToysBeauty;
