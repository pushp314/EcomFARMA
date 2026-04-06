import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineSortAscending, 
  HiOutlineX,
  HiOutlineShoppingBag,
  HiChevronRight,
  HiOutlineSparkles,
  HiOutlineLocationMarker,
  HiLightningBolt,
  HiHeart,
  HiOutlineHeart
} from 'react-icons/hi';

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
  const { toggleWishlist, isInWishlist } = useWishlist();

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Others'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll(filters);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Sync loss: Catalog unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400); 
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

  const removeFilter = (key) => {
    setFilters(prev => {
      const next = { ...prev, [key]: '' };
      if (key === 'search') setTempSearch('');
      return next;
    });
  };

  // Professional Skeletons
  const SkeletonCard = () => (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm animate-pulse">
       <div className="h-60 bg-gray-100"></div>
       <div className="p-8 space-y-4">
          <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
          <div className="h-3 bg-gray-50 rounded-full w-1/2"></div>
          <div className="pt-4 flex justify-between">
             <div className="h-6 bg-gray-100 rounded-full w-20"></div>
             <div className="h-8 bg-gray-100 rounded-xl w-24"></div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-28 pb-20">
      <div className="container-custom">
        {/* Cinematic Header Section */}
        <header className="mb-16 relative">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
               <div className="flex items-center gap-2 mb-4 animate-fade-in">
                  <HiOutlineSparkles className="text-primary-600 text-xl" />
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em]">Premium Field-to-Table Experience</span>
               </div>
               <h1 className="text-5xl md:text-6xl font-display font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  Direct from the <span className="text-primary-600 underline decoration-primary-200 decoration-8 underline-offset-8">Source</span>
               </h1>
               <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                  Connecting conscious global shoppers to verified artisanal farmers. No middlemen, no compromise, just pure provenance.
               </p>
            </div>
            
            {/* Geometric Background Element */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/5 blur-[80px] -z-10 rounded-full"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 bg-primary-600/5 blur-[120px] -z-10 rounded-full"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Control Tower (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-8 sticky top-32 h-fit">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/20 border border-gray-100/50 backdrop-blur-xl group">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="font-display font-bold text-gray-900 text-xl flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                     <HiOutlineFilter className="text-lg" />
                   </div>
                   Catalog Matrix
                 </h3>
                 <button onClick={clearFilters} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors">Reset</button>
               </div>

               {/* Category Grid */}
               <div className="mb-12">
                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-6 ml-1">Commodity Class</p>
                 <div className="grid grid-cols-1 gap-2.5">
                   <button 
                     onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                     className={`group w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm transition-all duration-300 ${filters.category === '' ? 'bg-primary-600 text-white font-bold shadow-xl shadow-primary-600/20' : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'}`}
                   >
                     <span>All Products</span>
                     <HiChevronRight className={filters.category === '' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                   </button>
                   {categories.map(c => (
                     <button 
                       key={c}
                       onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                       className={`group w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm transition-all duration-300 ${filters.category === c ? 'bg-primary-600 text-white font-bold shadow-xl shadow-primary-600/20' : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'}`}
                     >
                       <span>{c}</span>
                       <HiChevronRight className={filters.category === c ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                     </button>
                   ))}
                 </div>
               </div>

               {/* Price Dynamics */}
               <div className="mb-10">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-6 ml-1">Price Quotient (₹)</p>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">₹</span>
                       <input 
                         type="number" 
                         placeholder="Min" 
                         className="w-full bg-gray-50 border-none rounded-2xl text-xs py-3.5 pl-8 pr-4 focus:ring-2 focus:ring-primary-600/10 transition-all font-medium"
                         value={filters.minPrice}
                         onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                       />
                    </div>
                    <div className="relative flex-1">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">₹</span>
                       <input 
                         type="number" 
                         placeholder="Max" 
                         className="w-full bg-gray-50 border-none rounded-2xl text-xs py-3.5 pl-8 pr-4 focus:ring-2 focus:ring-primary-600/10 transition-all font-medium"
                         value={filters.maxPrice}
                         onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                       />
                    </div>
                  </div>
               </div>

               {/* Professional Ad Space/CTA in sidebar */}
               <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                     <HiOutlineSparkles className="text-6xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 relative z-10">Farm Pass Plus</h4>
                  <p className="text-white/70 text-[10px] mb-4 uppercase tracking-widest relative z-10">Premium Subscription</p>
                  <button className="w-full py-2.5 bg-white text-primary-600 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:scale-105 transition-all">Upgrade Now</button>
               </div>
            </div>
          </aside>

          {/* Commodity Feed */}
          <main className="flex-1 space-y-10">
            {/* Search and Global Selection */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/20 border border-gray-100 flex flex-wrap items-center justify-between gap-6 transition-all">
               <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[320px] group">
                 <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 text-xl transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search heritage seeds, artisanal honey, organic roots..." 
                   className="w-full pl-16 pr-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-gray-300"
                   value={tempSearch}
                   onChange={e => setTempSearch(e.target.value)}
                 />
               </form>

               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl text-xs text-gray-500 font-bold uppercase tracking-widest border border-gray-100"
                 >
                   <HiOutlineFilter /> Grid Options
                 </button>
                 <div className="flex items-center gap-2.5 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 min-w-[180px]">
                   <HiOutlineSortAscending className="text-gray-400" />
                   <select 
                    className="bg-transparent border-none text-[11px] font-bold text-gray-600 uppercase tracking-widest cursor-pointer focus:ring-0 p-0"
                    value={filters.sort}
                    onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                   >
                     <option value="newest">Fresh Collections</option>
                     <option value="price-low">Economic Tier</option>
                     <option value="price-high">Reserve Tier</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* Active Filters Display */}
            {(filters.category || filters.search || filters.minPrice || filters.maxPrice) && (
              <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mr-2">Operational Filters:</p>
                 {filters.category && (
                   <span className="flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-100">
                     Class: {filters.category}
                     <button onClick={() => removeFilter('category')}><HiOutlineX /></button>
                   </span>
                 )}
                 {filters.search && (
                   <span className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                     Term: {filters.search}
                     <button onClick={() => removeFilter('search')}><HiOutlineX /></button>
                   </span>
                 )}
                 {(filters.minPrice || filters.maxPrice) && (
                   <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                     Range: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
                     <button onClick={() => { removeFilter('minPrice'); removeFilter('maxPrice'); }}><HiOutlineX /></button>
                   </span>
                 )}
                 <button onClick={clearFilters} className="text-[10px] font-bold text-rose-500 hover:scale-105 transition-transform ml-2">TERMINATE ALL</button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-up">
                {products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 hover:-translate-y-2">
                    <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden">
                       <img 
                        src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <span className="w-fit bg-primary-600 text-white px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-xl border border-white/20">
                            {product.category}
                          </span>
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="w-fit bg-rose-500 text-white px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                               <HiLightningBolt /> Low Supply
                            </span>
                          )}
                       </div>

                       <div className="absolute top-6 right-6">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-gray-200/20 border border-white/20 group/heart scale-90 group-hover:scale-100 transition-all duration-500"
                          >
                             {isInWishlist(product.id) ? (
                               <HiHeart className="text-xl text-rose-500" />
                             ) : (
                               <HiOutlineHeart className="text-xl text-gray-400 group-hover/heart:text-rose-500 transition-colors" />
                             )}
                          </button>
                       </div>
                    </Link>
                    
                    <div className="p-10">
                       <div className="flex justify-between items-start mb-6">
                         <div className="flex-1">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-display font-bold text-gray-900 text-2xl group-hover:text-primary-600 transition-colors line-clamp-1 decoration-primary-200 decoration-2 underline-offset-4 group-hover:underline">{product.name}</h3>
                            </Link>
                          <Link to={`/farmer/${product.farmerId}`} className="group/farm flex items-center gap-2.5 mt-2.5">
                             <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-[9px] font-black text-primary-700">F</div>
                             <span className="text-[11px] font-bold text-gray-400 group-hover/farm:text-primary-600 transition-colors uppercase tracking-widest">{product.farmer?.farmName || product.farmer?.name}</span>
                          </Link>
                         </div>
                         <div className="text-right">
                            <p className="font-display font-bold text-primary-700 text-3xl">₹{product.price}</p>
                            <p className="text-[10px] font-bold text-gray-300 uppercase mt-1">per {product.unit}</p>
                         </div>
                       </div>

                       <div className="flex items-center justify-between pt-8 border-t border-gray-50 gap-4">
                          <div className="flex items-center gap-1.5 text-gray-400">
                             <HiOutlineLocationMarker className="text-sm" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">{product.farmer?.city || 'Verified'}</span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all duration-300 ${
                              product.stock > 0 
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 hover:scale-105 active:scale-95' 
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {product.stock > 0 ? (
                              <>
                                <HiOutlineShoppingBag className="text-base" />
                                Reserve
                              </>
                            ) : 'Exhausted'}
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[4rem] p-32 text-center border-2 border-dashed border-gray-100 shadow-xl shadow-gray-200/20 animate-fade-in relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full"></div>
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-200 ring-8 ring-white">
                   <HiOutlineSearch className="text-5xl" />
                </div>
                <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">Metric Disconnect</h3>
                <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm mx-auto mb-10">We couldn't synchronize any products with your current filter criteria.</p>
                <div className="flex justify-center gap-4">
                   <button onClick={clearFilters} className="btn-primary py-4 px-12 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary-600/30">Reset Catalog</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Grid Configuration Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in flex items-end">
           <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl transition-all" onClick={() => setShowMobileFilters(false)}></div>
           <div className="relative bg-white w-full rounded-t-[4rem] p-12 animate-slide-up max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-display font-bold text-gray-900">Config Grid</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">✕</button>
              </div>

              <div className="space-y-12 pb-10">
                 <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6 ml-2">Classify</p>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(c => (
                        <button 
                          key={c}
                          onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                          className={`px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${filters.category === c ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' : 'bg-gray-50 text-gray-500'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6 ml-2">Monetary Bound</p>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold"
                        value={filters.minPrice}
                        onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      />
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold"
                        value={filters.maxPrice}
                        onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                 </div>

                 <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-600/40">Sync Matrix</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
