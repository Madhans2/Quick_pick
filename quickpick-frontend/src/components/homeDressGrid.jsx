import React from 'react';
import { Link } from 'react-router-dom';

const Dress = [
  { title: 'Typography Black T-Shirt', price: '399', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745562435/fashions/680b1392bd0cb164525d0f81_fg8qfe.jpg', collection:"fashions" },
  { title: 'Printed White T-shirt', price: '299', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745562447/fashions/680b1390bd0cb164525d0f71_gixs21.jpg', collection:"fashions" },
  { title: 'Typography Round Neck', price: '279', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745562781/fashions/680b13a8bd0cb164525d0fd6_u6f5hg.jpg', collection:"fashions" },
  { title: 'Hooded Neck Cotton', price: '255', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745562478/fashions/680b1386bd0cb164525d0f53_ul7rnf.jpg', collection:"fashions" },
];

const BestMensDress = () => {
  return (
    <div className=' px-8 py-8'>
    <div className="w-full bg-white shadow-md p-8 my-8">
      <h2 className="text-2xl font-semibold mb-6">Best Men's Dress Recomendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Dress.map((item, i) => (
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

export default BestMensDress;
