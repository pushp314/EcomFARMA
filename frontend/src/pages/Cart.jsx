import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Load Razorpay Script dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'

  // Default to user's registered address, but allow modification for order
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const placeOrder = async (isPaid = false, paymentDetails = null) => {
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await orderAPI.create({
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === 'online' ? 'Razorpay' : 'Cash on Delivery',
        isPaid,
        paymentDetails,
      });

      toast.success(isPaid ? 'Payment successful! Order placed. 🎉' : 'Order placed successfully! 🎉');
      clearCart();
      navigate('/my-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your cart is empty');
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return toast.error('Please complete your shipping address');
    }

    setLoading(true);

    if (paymentMethod === 'cod') {
      await placeOrder(false);
      setLoading(false);
      return;
    }

    // Online Payment Flow (Razorpay)
    try {
      const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        setLoading(false);
        return;
      }

      // Create Order on Backend
      const cartTotal = getCartTotal();
      const { data } = await paymentAPI.createOrder({ amount: cartTotal });
      
      if (!data.success) {
        toast.error('Failed to initialize payment.');
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Farm Fresh',
        description: 'Payment for order',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await paymentAPI.verify(response);
            if (verifyRes.data.success) {
              await placeOrder(true, response);
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (error) {
            toast.error('Payment verification error.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || '',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed or was cancelled.');
      });
      paymentObject.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment system error. Please use COD.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li key={item.product.id} className="py-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                <img 
                  src={item.product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">From {item.product.farmer?.farmName}</p>
                  <div className="text-green-600 font-bold mt-1">₹{item.price} / {item.product.unit}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.product.stock)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="font-medium w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.product.stock)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                
                <div className="font-bold text-lg w-20 text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary & Checkout */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600 border-b border-gray-100 pb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            
            <div className="flex justify-between mb-6 text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="font-bold text-gray-700 border-t border-gray-100 pt-4">Delivery Details</h3>
              
              <input 
                type="text" 
                placeholder="Street Address" 
                required 
                className="input-field py-2" 
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="City" 
                  required 
                  className="input-field py-2" 
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="State" 
                  required 
                  className="input-field py-2" 
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                />
              </div>
              <input 
                type="text" 
                placeholder="Pincode" 
                required 
                maxLength="6"
                className="input-field py-2" 
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
              />

              <h3 className="font-bold text-gray-700 border-t border-gray-100 pt-4 mt-2">Payment Method</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod('cod')} 
                  className={`py-2 px-4 rounded-lg border-2 text-sm font-bold transition-all ${paymentMethod === 'cod' ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500 hover:border-green-200'}`}
                >
                  Cash on Delivery
                </button>
                <button 
                  type="button" 
                  onClick={() => setPaymentMethod('online')} 
                  className={`py-2 px-4 rounded-lg border-2 text-sm font-bold transition-all flex justify-center items-center gap-1 ${paymentMethod === 'online' ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-200 text-gray-500 hover:border-green-200'}`}
                >
                  Pay Online <span className="text-xs">💳</span>
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 mt-4 text-lg shadow-lg relative overflow-hidden group"
              >
                {loading ? 'Processing...' : `Place Order (${paymentMethod === 'cod' ? 'COD' : 'Online'})`}
                <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
