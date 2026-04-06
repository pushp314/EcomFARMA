import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [productRes, reviewRes] = await Promise.all([
        productAPI.getById(id),
        productAPI.getReviews(id)
      ]);
      setProduct(productRes.data.product);
      setReviews(reviewRes.data.reviews);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to share your feedback');
    
    try {
      setSubmitting(true);
      await productAPI.addReview(id, { rating, comment });
      toast.success('Your review is live! 🥗');
      setComment('');
      setRating(5);
      fetchProductAndReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 italic">Produce not found in catalog.</div>;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all mb-8 group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Cinematic Hero Image */}
            <div className="h-[400px] lg:h-auto min-h-[500px] relative overflow-hidden group">
               <img 
                 src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200'} 
                 alt={product.name}
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary-700 shadow-lg border border-white/20">
                    {product.category}
                  </span>
                  <span className={`bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-lg border border-white/20 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'In Season' : 'End of Season'}
                  </span>
               </div>
            </div>

            {/* Premium Details Area */}
            <div className="p-8 md:p-14 flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-4">
                  {averageRating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                       <HiStar className="text-yellow-500" />
                       <span className="text-sm font-bold text-yellow-700">{averageRating}</span>
                       <span className="text-xs text-yellow-600/60 font-medium">({reviews.length} reviews)</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Fresh Release</span>
               </div>

               <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
               
               <Link to={`/farmer/${product.farmerId}`} className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-600/20 hover:bg-white transition-all group">
                  <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                    <img src={product.farmer?.avatarUrl || `https://ui-avatars.com/api/?name=${product.farmer?.name}&background=16a34a&color=fff`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Produced By</p>
                    <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-none">{product.farmer?.farmName || product.farmer?.name}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs font-bold text-primary-600">{product.farmer?.city}, {product.farmer?.state}</p>
                  </div>
               </Link>

               <div className="space-y-6 mb-10">
                  <p className="text-gray-500 leading-relaxed text-lg italic bg-primary-50/30 p-6 rounded-2xl border-l-4 border-primary-500">
                    "{product.description || 'Harvested at peak ripeness and delivered directly from our fields to your kitchen, ensuring maximum nutritional value and unbeatable flavor.'}"
                  </p>
               </div>

               <div className="flex flex-wrap items-center gap-8 mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900 tracking-tighter">₹{product.price}</span>
                    <span className="text-xl text-gray-400 font-medium">/{product.unit}</span>
                  </div>
                  <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-sm font-bold text-gray-900">{product.stock} {product.unit} left</p>
                  </div>
               </div>

               <button 
                 onClick={() => addToCart(product)}
                 disabled={product.stock === 0}
                 className={`py-5 text-lg font-bold w-full rounded-2xl flex justify-center items-center gap-3 transition-all ${
                   product.stock > 0 
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 }`}
               >
                 <HiOutlineShoppingBag className="text-2xl" />
                 {product.stock > 0 ? 'Secure Harvest' : 'End of Season'}
               </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           <div className="lg:col-span-1">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Merchant Integrity</h2>
              <p className="text-gray-500 text-sm mb-8">Verification of quality by the EcomFarma community.</p>
              
              {user?.role === 'customer' ? (
                <form onSubmit={submitReview} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/50 space-y-6">
                  <h3 className="font-bold text-gray-900">Share your harvest experience</h3>
                  
                  <div className="flex items-center gap-2 justify-center py-4 bg-gray-50 rounded-2xl">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         className={`text-3xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:scale-105'}`}
                         onMouseEnter={() => setHover(star)}
                         onMouseLeave={() => setHover(0)}
                         onClick={() => setRating(star)}
                       >
                         <HiStar />
                       </button>
                     ))}
                  </div>

                  <textarea 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 h-32" 
                    placeholder="Describe the freshness, taste, and packaging..."
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button type="submit" disabled={submitting} className="w-full btn-primary py-4 rounded-xl shadow-lg shadow-primary-500/20 font-bold italic tracking-wide">
                    {submitting ? 'Authenticating...' : 'Post Verified Review'}
                  </button>
                </form>
              ) : !user ? (
                <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 text-center">
                   <p className="text-sm font-bold text-primary-700 mb-3">Join our community to leave feedback</p>
                   <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:underline">Sign In Required</Link>
                </div>
              ) : null}
           </div>

           <div className="lg:col-span-2">
              {reviews.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                   <span className="text-4xl mb-3">🍃</span>
                   <p className="text-gray-400 font-medium italic">No testimonials available for this crop yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center font-bold text-primary-700 border border-white shadow-sm">
                              {rev.user?.name[0]}
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900 leading-none mb-1">{rev.user?.name}</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</p>
                           </div>
                         </div>
                         <div className="flex gap-0.5">
                           {[1, 2, 3, 4, 5].map(i => (
                             <HiStar key={i} className={`text-sm ${i <= rev.rating ? 'text-yellow-400' : 'text-gray-100'}`} />
                           ))}
                         </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
