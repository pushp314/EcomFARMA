import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Others'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll({ search: searchTerm, category });
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]); // Re-fetch when category changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-display font-bold text-gray-800 mb-8">Farm Fresh Marketplace</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search for fresh produce..."
            className="input-field flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Search
          </button>
        </form>

        {/* Categories */}
        <select
          className="input-field md:w-48 appearance-none bg-white font-medium text-gray-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-card overflow-hidden transition-transform hover:-translate-y-1">
              <Link to={`/product/${product.id}`} className="block h-48 bg-gray-200 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-green-600 transition-colors">
                    {product.name}
                  </Link>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description || 'Freshly harvested product directly from the farm.'}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">
                    By {product.farmer?.farmName || product.farmer?.name}
                  </span>
                  <span className="text-xs text-gray-500">📍 {product.farmer?.city}</span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-green-700">₹{product.price}<span className="text-sm text-gray-500 font-normal">/{product.unit}</span></p>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="btn-primary py-1.5 px-3 text-sm"
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🥕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500">Try adjusting your search or category filter.</p>
          <button 
            className="mt-4 text-green-600 font-medium hover:underline"
            onClick={() => { setSearchTerm(''); setCategory(''); }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
