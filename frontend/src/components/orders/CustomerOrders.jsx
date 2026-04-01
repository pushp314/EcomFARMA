import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import { HiOutlineShoppingBag, HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await orderAPI.getMyOrders();
                setOrders(data.orders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-16 text-center animate-fade-in max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-6xl">🛍️</div>
                <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">No Harvests Yet</h3>
                <p className="text-gray-500 mb-10 leading-relaxed italic">"The best time to plant a tree was 20 years ago. The second best time is now." Start your farm-to-table journey today.</p>
                <Link to="/marketplace" className="btn-primary py-4 px-10 rounded-2xl shadow-xl shadow-primary-500/30 font-bold inline-flex items-center gap-2 group">
                   Visit Marketplace
                   <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <header className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Receipt Archives</p>
                  <h2 className="text-3xl font-display font-bold text-gray-900">Purchase History</h2>
               </div>
               <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">Total Records: {orders.length}</span>
            </header>
            
            <div className="grid gap-8">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:border-primary-100 transition-all hover:shadow-xl hover:shadow-gray-200/40">
                        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors shadow-sm">
                                   <HiOutlineShoppingBag className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Order ID</p>
                                    <p className="font-bold text-gray-900">#{order.id.split('-')[0].toUpperCase()}</p>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date Placed</p>
                                <p className="font-bold text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Financial Status</p>
                                <div className="flex items-center gap-2">
                                  <HiOutlineShieldCheck className={order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-gray-300'} />
                                  <p className={`font-bold text-xs ${order.paymentStatus === 'Paid' ? 'text-green-700' : 'text-gray-500'}`}>{order.paymentStatus}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Settlement</p>
                                    <p className="font-bold text-primary-700 text-lg">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                                <Link to={`/order/${order.id}`} className="p-3 bg-white border border-gray-200 rounded-2xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                   <HiOutlineArrowRight />
                                </Link>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-wrap gap-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex-1 min-w-[280px] bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-transparent hover:border-gray-200 transition-colors">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                                           <img src={item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.product?.name || 'Produce Item'}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Merchant: {item.product?.farmer?.farmName}</p>
                                            <p className="text-xs text-gray-500 font-medium">Qty: <span className="font-bold text-gray-900">{item.quantity}</span></p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-xs font-bold text-primary-700">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                               <div className="flex items-center gap-4">
                                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                      'bg-orange-100 text-orange-700'
                                  }`}>
                                      <HiOutlineTruck className="text-sm" />
                                      {order.status}
                                  </div>
                               </div>
                               <Link to={`/order/${order.id}`} className="text-xs font-bold text-primary-600 hover:underline uppercase tracking-[0.2em]">Detailed Manifest →</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerOrders;
