import React from 'react';
import { Link } from 'react-router-dom';

const homeAppliances = [
  { title: 'Phones', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817484/phones_hmy4tv.png', collection:"mobiles" },
  { title: 'Appliances', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817484/Appliances_gllqra.png', collection:"appliances" },
  { title: 'Kitchen', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817483/Kitchen_nwmpsl.png', collection:"kitchens" },
  { title: 'Toys', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817485/Toys_qzuir4.png', collection:"toys" },
];

const HomeAppliances = () => {
  return (
    <div className=' px-8 py-8'>
    <div className="w-full bg-white shadow-md p-8 my-8">
      <h2 className="text-2xl font-semibold mb-6">Best Recomendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {homeAppliances.map((item, i) => (
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
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default HomeAppliances;
