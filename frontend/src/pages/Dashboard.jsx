import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineArrowRight,
  HiOutlineBadgeCheck,
  HiOutlineClock
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setRecentOrders(data.orders.slice(0, 3));
      } catch (error) {
        console.error("Sync failed");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'customer') fetchRecentOrders();
    else setLoading(false);
  }, [user]);

  const customerCards = [
    { title: 'Market Track', desc: 'Active & past orders', icon: HiOutlineClipboardList, link: '/my-orders', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { title: 'Fresh Stock', desc: 'Browse latest harvest', icon: HiOutlineShoppingBag, link: '/marketplace', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Favorites', desc: 'Saved farm produce', icon: HiOutlineHeart, link: '/wishlist', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { title: 'Feedback', desc: 'Rate your purchases', icon: HiOutlineStar, link: '/reviews', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { title: 'Local Radius', desc: 'Nearby farm network', icon: HiOutlineLocationMarker, link: '/marketplace?nearby=true', color: 'bg-sky-50 text-sky-600 border-sky-100' },
    { title: 'Logistics', desc: 'Real-time tracking', icon: HiOutlineTruck, link: '/track', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#fafbfc]">
      <div className="container-custom">
        {/* Header Hero */}
        <section className="mb-14 relative group animate-fade-in">
           <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 rounded-[3rem] blur-3xl opacity-20 transition-opacity duration-700 group-hover:opacity-30 -z-10"></div>
           <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden flex flex-wrap items-center justify-between gap-8">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                 <HiOutlineBadgeCheck className="text-[12rem] text-primary-600" />
              </div>
              
              <div className="flex items-center gap-8 relative z-10">
                 <div className="relative">
                    <img
                      src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=22c55e&color=fff`}
                      alt={user?.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] object-cover ring-8 ring-gray-50 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                       <HiOutlineBadgeCheck className="text-xl" />
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Identity Verified</p>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                      Namaste, {user?.name?.split(' ')[0]} 🥕
                    </h1>
                    <p className="text-gray-500 text-lg mt-3 max-w-md font-medium">
                       Your farm-to-table ecosystem is active. Access your logistics, catalogs, and preferences from this hub.
                    </p>
                 </div>
              </div>

              <div className="flex gap-4 relative z-10">
                 {user?.role === 'customer' && (
                   <Link to="/marketplace" className="btn-primary py-4 px-10 rounded-[2rem] shadow-xl shadow-primary-600/30 font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                      Browse Harvest
                   </Link>
                 )}
                 {user?.role === 'farmer' && (
                   <Link to="/farmer/dashboard" className="btn-primary py-4 px-10 rounded-[2rem] shadow-xl shadow-primary-600/30 font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                      Internal OPS
                   </Link>
                 )}
                 {user?.role === 'admin' && (
                   <Link to="/admin/dashboard" className="btn-primary py-4 px-10 rounded-[2rem] shadow-xl shadow-primary-600/30 font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                      Global Control
                   </Link>
                 )}
              </div>
           </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">
           {/* Left Column: Quick Actions */}
           <div className="lg:col-span-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">
                {customerCards.map((card, i) => (
                  <Link
                    key={card.title}
                    to={card.link}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 group hover:-translate-y-1 transition-all duration-500 flex items-center gap-6"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl border-2 ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg ring-4 ring-offset-2 ring-white`}>
                      <card.icon className="text-3xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{card.title}</h3>
                      <p className="text-sm text-gray-400 font-medium mt-1 leading-tight">{card.desc}</p>
                    </div>
                    <HiOutlineArrowRight className="ml-auto text-gray-300 group-hover:text-primary-600 group-hover:translate-x-2 transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
           </div>

           {/* Right Column: Recent Activity */}
           <div className="lg:col-span-4 space-y-8 animate-slide-left">
              <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent pointer-events-none"></div>
                 
                 <div className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                       <h3 className="text-xl font-bold font-display leading-none">Recent Shipments</h3>
                       <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-2 leading-none">Activity Feed</p>
                    </div>
                    <HiOutlineClock className="text-3xl text-gray-700" />
                 </div>

                 {loading ? (
                    <div className="h-48 flex items-center justify-center"><LoadingSpinner /></div>
                 ) : recentOrders.length > 0 ? (
                    <div className="space-y-6 relative z-10">
                       {recentOrders.map((order, i) => (
                          <div key={order.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">📦</div>
                             <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-start mb-1">
                                   <p className="text-sm font-bold truncate pr-2">#{order.id.slice(-6).toUpperCase()}</p>
                                   <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                      order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                   }`}>{order.status}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 truncate">{new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount.toLocaleString()}</p>
                             </div>
                          </div>
                       ))}
                       <Link to="/my-orders" className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/5">
                          View Full History ( {recentOrders.length} )
                       </Link>
                    </div>
                 ) : (
                    <div className="py-20 text-center relative z-10">
                       <p className="text-gray-500 italic text-sm">Logistics queue is currently idle.</p>
                       <Link to="/marketplace" className="text-primary-400 text-[10px] font-bold uppercase tracking-widest mt-4 inline-block hover:text-white transition-colors">Start Shopping →</Link>
                    </div>
                 )}
                 
                 {/* Decorative element */}
                 <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Ecosystem Integrity</p>
                    <div className="flex -space-x-3">
                       {[0, 1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                       ))}
                       <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-primary-600 flex items-center justify-center text-[10px] font-bold">+241</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
