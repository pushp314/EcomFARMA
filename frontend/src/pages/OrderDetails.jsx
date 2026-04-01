import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineClock } from 'react-icons/hi';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await orderAPI.getById(id);
        setOrder(data.order);
      } catch (error) {
        toast.error('Failed to retrieve order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;
  if (!order) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Order not found in global archive.</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Confirmed': return 'bg-primary-100 text-primary-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all mb-8 group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to My History
        </Link>

        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
           {/* Order Header Card */}
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-wrap justify-between items-center gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                       Logistic Status: {order.status}
                    </span>
                 </div>
                 <h1 className="text-4xl font-display font-bold text-gray-900 leading-tight">Receipt #{order.id.slice(-8).toUpperCase()}</h1>
                 <p className="text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right">
                 <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Settlement Total</p>
                 <p className="text-5xl font-bold text-primary-700 tracking-tighter">₹{order.totalAmount?.toLocaleString()}</p>
                 <p className="text-xs text-green-600 font-bold mt-1 uppercase tracking-widest">{order.paymentStatus === 'Paid' ? '✓ Transaction Clear' : '• Payment Pending'}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Inventory Area */}
              <div className="lg:col-span-2 space-y-4">
                 <h2 className="text-xl font-bold text-gray-900 ml-4 mb-4">Marketplace Fulfillment</h2>
                 <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
                    <ul className="divide-y divide-gray-50">
                       {order.items.map((item) => (
                         <li key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-wrap sm:flex-nowrap items-center gap-6 group">
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                               <img src={item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU ID: {item.product?.id?.slice(-6) || 'N/A'}</p>
                               <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{item.product?.name || 'Produce Item'}</h3>
                               <p className="text-xs font-bold text-primary-600">Merchant Product Code</p>
                            </div>
                            <div className="text-right min-w-[120px]">
                               <p className="text-gray-900 font-bold">₹{item.price} × {item.quantity}</p>
                               <p className="text-xl font-bold text-primary-700 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>

              {/* Logistic & Settlement Summary Sidebar */}
              <div className="space-y-8">
                 <h2 className="text-xl font-bold text-gray-900 ml-4 mb-4">Logistic & Billing</h2>
                 
                 {/* Destination Block */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4 h-fit">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                       <HiOutlineLocationMarker className="text-2xl text-gray-400" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ship-to Destination</p>
                       <p className="font-bold text-gray-900 text-lg leading-tight mb-2">{order.customer?.name}</p>
                       <p className="text-gray-500 text-sm leading-relaxed italic">
                         {order.shippingStreet}, {order.shippingCity}<br />
                         {order.shippingState} - {order.shippingPincode}
                       </p>
                    </div>
                 </div>

                 {/* Payment Block */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4 h-fit">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                       <HiOutlineCreditCard className="text-2xl text-gray-400" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Financial Settlement</p>
                       <p className="font-bold text-gray-900 text-sm">{order.paymentId ? `Transaction: ${order.paymentId}` : 'Method: COD / Internal Credit'}</p>
                       <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                         Account {order.paymentStatus}
                       </span>
                    </div>
                 </div>

                 {/* Timeline Block (Visual) */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                       <HiOutlineClock className="text-lg" />
                       Fulfillment Timeline
                    </p>
                    <div className="space-y-6">
                       {[
                         { label: 'Authorized', date: order.createdAt, done: true },
                         { label: 'Merchant Confirmed', date: null, done: order.status !== 'Pending' },
                         { label: 'Dispatched', date: null, done: order.status === 'Shipped' || order.status === 'Delivered' },
                         { label: 'Arrival at Destination', date: null, done: order.status === 'Delivered' },
                       ].map((step, i) => (
                         <div key={i} className="flex gap-4 items-start relative pb-6 last:pb-0">
                            {i < 3 && <div className={`absolute left-2.5 top-8 w-px h-[calc(100%-8px)] ${step.done ? 'bg-primary-500' : 'bg-gray-100'}`}></div>}
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${step.done ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'}`}></div>
                            <div>
                               <p className={`text-xs font-bold uppercase tracking-wider ${step.done ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                               {step.date && <p className="text-[10px] text-gray-400 font-medium">{new Date(step.date).toLocaleDateString()}</p>}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
