import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI, productAPI } from '../api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  HiOutlineLocationMarker, 
  HiOutlineShoppingBag, 
  HiOutlineArrowLeft,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineSparkles
} from 'react-icons/hi';

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        setLoading(true);
        const { data } = await authAPI.getFarmerProfile(id);
        setFarmer(data.farmer);
      } catch (error) {
        toast.error('Identity sync lost: Farmer unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;
  if (!farmer) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 italic letter-spacing-widest">Farmer identity not found in database.</div>;

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-28 pb-20">
      <div className="container-custom">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all mb-12 group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Return to Marketplace
        </Link>

        {/* Farmer Header Hero */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-wrap items-center justify-between gap-12 mb-20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <HiOutlineBadgeCheck className="text-[14rem] text-primary-600" />
           </div>

           <div className="flex flex-wrap md:flex-nowrap items-center gap-10 relative z-10">
              <div className="relative shrink-0">
                 <img 
                    src={farmer.avatarUrl || `https://ui-avatars.com/api/?name=${farmer.name}&background=16a34a&color=fff`} 
                    alt={farmer.name} 
                    className="w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] object-cover ring-8 ring-gray-50 shadow-2xl"
                 />
                 <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                    <HiOutlineBadgeCheck className="text-2xl" />
                 </div>
              </div>
              
              <div className="max-w-xl">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-100">Verified Artisan</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><HiOutlineClock /> Joined {new Date(farmer.createdAt).getFullYear()}</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">{farmer.farmName || farmer.name}</h1>
                 <div className="flex items-center gap-2 text-gray-500 font-medium mb-6">
                    <HiOutlineLocationMarker className="text-primary-600 text-xl" />
                    <span className="text-lg">{farmer.city}, {farmer.state}, {farmer.country}</span>
                 </div>
                 <p className="text-gray-400 text-lg leading-relaxed italic">
                    "{farmer.farmDescription || 'Our farm is dedicated to sustainable, chemical-free agriculture, bringing the purest harvest directly to your doorstep.'}"
                 </p>
              </div>
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-2 gap-6 relative z-10 w-full lg:w-auto">
              <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 text-center flex-1">
                 <p className="text-3xl font-display font-bold text-gray-900 mb-1">{farmer.products?.length || 0}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Listings</p>
              </div>
              <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 text-center flex-1">
                 <p className="text-3xl font-display font-bold text-gray-900 mb-1">100%</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Direct Trade</p>
              </div>
           </div>
        </div>

        {/* Farmer Product Grid */}
        <section>
           <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-px bg-gray-200"></div>
              <h2 className="text-2xl font-display font-bold text-gray-900 whitespace-nowrap flex items-center gap-3">
                 Live Harvest Catalog
                 <HiOutlineSparkles className="text-primary-600" />
              </h2>
              <div className="flex-1 h-px bg-gray-100"></div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {farmer.products?.map((product) => (
                <div key={product.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <Link to={`/product/${product.id}`} className="block relative h-56 overflow-hidden">
                     <img 
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                     />
                     <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-primary-700 shadow-xl border border-white/20">
                          {product.category}
                        </span>
                     </div>
                  </Link>
                  
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-6">
                       <Link to={`/product/${product.id}`}>
                         <h3 className="font-display font-bold text-gray-900 text-xl group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                       </Link>
                       <div className="text-right shrink-0">
                          <p className="font-display font-bold text-primary-700 text-xl leading-none">₹{product.price}</p>
                          <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">/{product.unit}</p>
                       </div>
                     </div>

                     <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
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
              ))}
           </div>
           
           {farmer.products?.length === 0 && (
              <div className="py-24 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100">
                 <p className="text-gray-400 font-medium text-lg italic">The harvest is currently in maturation. Check back soon for the next collection.</p>
              </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default FarmerProfile;
