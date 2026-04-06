import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { 
  HiOutlineTrash, 
  HiOutlineShoppingBag, 
  HiOutlineHeart, 
  HiOutlineArrowLeft, 
  HiOutlineSparkles 
} from 'react-icons/hi';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="container-custom text-center">
           <div className="bg-white p-16 rounded-[4rem] shadow-xl shadow-gray-200/40 border border-gray-100 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50 to-transparent pointer-events-none"></div>
              <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner">💚</div>
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-6 leading-tight">Your Wishlist is Dreaming</h1>
              <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto font-medium leading-relaxed italic">
                 Curate your ideal farm-to-table collection and monitor seasonal availability from this hub.
              </p>
              <Link to="/marketplace" className="btn-primary py-4 px-12 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/30 inline-flex items-center gap-3">
                 Explore Harvest <HiOutlineArrowLeft className="rotate-180" />
              </Link>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafbfc]">
      <div className="container-custom">
        <header className="mb-16 flex flex-wrap justify-between items-end gap-10">
           <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                 <HiOutlineSparkles className="text-primary-600" />
                 <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em]">Curated Favorites</span>
              </div>
              <h1 className="text-5xl font-display font-bold text-gray-900 leading-tight tracking-tight">Your Harvest <span className="text-primary-600">Reserved</span></h1>
              <p className="text-gray-400 font-medium text-lg mt-3">Monitoring {wishlist.length} artisanal crops for you.</p>
           </div>
           <Link to="/marketplace" className="btn-secondary py-4 px-10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-2 border-gray-100 hover:border-primary-100 bg-white">
              <HiOutlineArrowLeft /> Market Index
           </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 animate-slide-up">
          {wishlist.map((product) => (
            <div key={product.id} className="group bg-white rounded-[3rem] shadow-xl shadow-gray-200/20 border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
               <div className="h-64 relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-6 right-6">
                     <button 
                        onClick={() => toggleWishlist(product)}
                        className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-rose-500 shadow-xl border border-white/20 hover:scale-110 transition-all group-hover:rotate-6"
                     >
                        <HiOutlineTrash className="text-xl" />
                     </button>
                  </div>
                  <div className="absolute top-6 left-6">
                     <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-primary-700 shadow-lg border border-white/20">
                        {product.category}
                     </span>
                  </div>
               </div>
               
               <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h3 className="font-display font-bold text-gray-900 text-2xl group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{product.farmer?.farmName}</p>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="font-display font-bold text-primary-700 text-3xl">₹{product.price}</p>
                        <span className="text-[10px] text-gray-300 font-bold uppercase">/ {product.unit}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                          product.stock > 0 
                            ? 'btn-primary shadow-xl shadow-primary-600/20 hover:scale-105 active:scale-95' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {product.stock > 0 ? (
                           <>
                              <HiOutlineShoppingBag className="text-base" />
                              Move to Basket
                           </>
                        ) : 'Sold Out'}
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
