import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductListPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [showFilter, setShowFilter] = useState(false);

  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${category}`);
        setProducts(res.data);
        setFilteredProducts(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [maxPrice, sortOrder, products]);

  const applyFilters = () => {
    let updated = [...products];
    updated = updated.filter(product => product.price <= maxPrice);

    if (sortOrder === 'low') {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setMaxPrice(100000);
    setSortOrder('');
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="bg-[#E6C989] min-h-screen p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 capitalize">{category} Products</h2>

      <button
        className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded mb-4"
        onClick={() => setShowFilter(prev => !prev)}
      >
        {showFilter ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white p-4 rounded shadow-md w-full sm:w-64 mb-6">
          <h3 className="font-semibold text-lg mb-4">Filters</h3>

          {/* Price Filter */}
          <div className="mb-4">
            <label className="font-medium">Price</label>
            <input
              type="range"
              min={0}
              max={100000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>Min: ₹0</span>
              <span>Max: ₹{maxPrice}</span>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="mb-4">
            <p className="font-medium">Sort by Price</p>
            <label className="block mt-2">
              <input
                type="radio"
                name="sort"
                checked={sortOrder === 'low'}
                onChange={() => setSortOrder('low')}
              />{' '}
              Low to High
            </label>
            <label className="block">
              <input
                type="radio"
                name="sort"
                checked={sortOrder === 'high'}
                onChange={() => setSortOrder('high')}
              />{' '}
              High to Low
            </label>
          </div>

          <button onClick={clearFilters} className="text-blue-600 hover:underline">
            Clear Filter
          </button>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : currentItems.length === 0 ? (
        <p className="text-red-600">No products found in this category.</p>
      ) : (
        <>
          {currentItems.map((product, index) => (
            <Link
              key={product._id || index}
              to={`/product/${category}/${product._id}`}
            >
              <div className="bg-white mb-4 sm:mb-6 p-4 sm:p-6 rounded shadow flex flex-col sm:flex-row items-center sm:items-start justify-between hover:shadow-lg transition">
                <img
                  src={product.image_url || '/placeholder.png'}
                  alt={product.title}
                  className="w-28 sm:w-32 h-28 sm:h-32 object-contain mb-4 sm:mb-0"
                />
                <div className="flex-1 sm:px-6 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm">Brand: {product.brand}</p>
                  <p className="text-yellow-500 font-medium">
                    ⭐ {product.rating || 'N/A'} / 5
                  </p>
                  <p className="text-green-600 font-semibold">{product.offer}</p>
                  <p className="text-black font-bold text-lg mt-2">₹{product.price}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button className="text-xl text-gray-500 hover:text-red-500">♡</button>
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-base sm:text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListPage;
