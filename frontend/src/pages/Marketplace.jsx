import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineSortAscending, HiOutlineX } from 'react-icons/hi';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Multi-Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  
  const [tempSearch, setTempSearch] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart();

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Others'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll(filters);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce for search/price typing
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: tempSearch }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
    setTempSearch('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Direct from the Farm</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Connecting you to locally-grown fresh produce with zero middlemen and maximum freshness.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <HiOutlineFilter className="text-primary-600" />
                   Filters
                 </h3>
                 <button onClick={clearFilters} className="text-xs text-primary-600 font-bold hover:underline">Clear All</button>
               </div>

               {/* Category Filter */}
               <div className="mb-8">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
                 <div className="space-y-2">
                   <button 
                     onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === '' ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     All Products
                   </button>
                   {categories.map(c => (
                     <button 
                       key={c}
                       onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                       className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === c ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                     >
                       {c}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Price Filter */}
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Price Range (₹)</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full bg-gray-50 border-none rounded-xl text-sm p-2 focus:ring-2 focus:ring-primary-500"
                      value={filters.minPrice}
                      onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                    <span className="text-gray-300">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full bg-gray-50 border-none rounded-xl text-sm p-2 focus:ring-2 focus:ring-primary-500"
                      value={filters.maxPrice}
                      onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
               </div>
            </div>
          </aside>

          {/* Product Feed */}
          <main className="flex-1">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
               {/* Search Bar */}
               <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[280px]">
                 <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                 <input 
                   type="text" 
                   placeholder="Search products, farms, or categories..." 
                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                   value={tempSearch}
                   onChange={e => setTempSearch(e.target.value)}
                 />
               </form>

               {/* Sort Toggle */}
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm text-gray-600 font-medium"
                 >
                   <HiOutlineFilter /> Filters
                 </button>
                 <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                   <HiOutlineSortAscending className="text-gray-400" />
                   <select 
                    className="bg-transparent border-none text-sm font-bold text-gray-700 cursor-pointer focus:ring-0"
                    value={filters.sort}
                    onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                   >
                     <option value="newest">Newest First</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                   </select>
                 </div>
               </div>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200 transition-all duration-300">
                    <Link to={`/product/${product.id}`} className="block relative h-56 overflow-hidden">
                       <img 
                        src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute top-4 left-4">
                         <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-700 shadow-sm border border-white/20">
                           {product.category}
                         </span>
                       </div>
                    </Link>
                    
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2 gap-2">
                         <Link to={`/product/${product.id}`}>
                           <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                         </Link>
                         <p className="font-bold text-primary-700 text-lg">₹{product.price}</p>
                       </div>

                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-[10px] font-bold text-orange-600">
                            F
                          </div>
                          <span className="text-xs text-gray-500 font-medium">By {product.farmer?.farmName || product.farmer?.name}</span>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Per {product.unit}</div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              product.stock > 0 
                                ? 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white shadow-sm' 
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <HiOutlineSearch className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-8">We couldn't find anything matching your current filters.</p>
                <button onClick={clearFilters} className="btn-primary py-3 px-8 text-sm">Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
           <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] p-8 animate-slide-up max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 transition-none">Filter Experience</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full"><HiOutlineX /></button>
              </div>

              <div className="space-y-10 pb-8">
                 <div className="grid grid-cols-2 gap-3">
                   {categories.map(c => (
                     <button 
                       key={c}
                       onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                       className={`px-4 py-3 rounded-2xl text-sm transition-all ${filters.category === c ? 'bg-primary-600 text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                     >
                       {c}
                     </button>
                   ))}
                 </div>

                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Price Range (₹)</p>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-4"
                        value={filters.minPrice}
                        onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      />
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-4"
                        value={filters.maxPrice}
                        onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                 </div>

                 <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-primary-500/30">Apply Filters</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
