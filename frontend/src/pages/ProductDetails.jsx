import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review form state
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
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    if (user.role !== 'customer') return toast.error('Only customers can leave reviews');

    try {
      setSubmitting(true);
      await productAPI.addReview(id, { rating, comment });
      toast.success('Review added successfully!');
      setComment('');
      setRating(5);
      fetchProductAndReviews(); // refresh
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (!product) return <div className="py-20 text-center">Product not found.</div>;

  return (
    <div className="container-custom py-12">
      <div className="mb-6">
        <Link to="/marketplace" className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1">
          ← Back to Marketplace
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="h-96 md:h-full min-h-[400px] bg-gray-100 relative">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-green-700 shadow-sm">
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src={product.farmer?.avatarUrl || 'https://via.placeholder.com/40'} alt={product.farmer?.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{product.farmer?.farmName || product.farmer?.name}</p>
                  <p className="text-xs text-gray-500">📍 {product.farmer?.city || 'Local Farm'}, {product.farmer?.state}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">
              {product.description || 'Freshly harvested product directly from the farm to your table.'}
            </p>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg text-gray-500 mb-1">/ {product.unit}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Availability</p>
                {product.stock > 0 ? (
                  <p className="font-bold text-green-600">{product.stock} {product.unit} in stock</p>
                ) : (
                  <p className="font-bold text-red-500">Out of Stock</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="btn-primary py-4 text-lg w-full flex justify-center items-center gap-2 shadow-xl shadow-green-600/20"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        
        {/* Write a review (only for customers) */}
        {user?.role === 'customer' && (
          <form onSubmit={submitReview} className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-10">
            <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select className="input-field bg-white w-32" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
              <textarea 
                className="input-field bg-white py-3 h-24" 
                placeholder="Share your experience..."
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary px-6">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* List Reviews */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <img src={rev.user?.avatarUrl || 'https://via.placeholder.com/40'} alt="Avatar" className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{rev.user?.name}</h4>
                    <span className="text-xs text-gray-400">• {new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-yellow-400 text-sm mb-2 font-medium">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p className="text-gray-600">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
