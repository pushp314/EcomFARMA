import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineLocationMarker,
  HiOutlineTruck,
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();

  const customerCards = [
    { title: 'My Orders', desc: 'Track and manage your orders', icon: HiOutlineClipboardList, link: '/my-orders', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { title: 'Browse Products', desc: 'Discover fresh farm produce', icon: HiOutlineShoppingBag, link: '/marketplace', color: 'bg-primary-50 text-primary-600 border-primary-200' },
    { title: 'My Wishlist', desc: 'Products you saved for later', icon: HiOutlineHeart, link: '/wishlist', color: 'bg-pink-50 text-pink-600 border-pink-200' },
    { title: 'My Reviews', desc: 'Rate products you purchased', icon: HiOutlineStar, link: '/reviews', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { title: 'Nearby Farmers', desc: 'Find farmers near your location', icon: HiOutlineLocationMarker, link: '/marketplace?nearby=true', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { title: 'Track Delivery', desc: 'Real-time order tracking', icon: HiOutlineTruck, link: '/track', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card p-8 mb-8 bg-gradient-to-r from-primary-600 to-primary-700 border-none text-white">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar?.url}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl ring-4 ring-white/20"
            />
            <div>
              <h1 className="font-display text-2xl font-bold">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-200 text-sm mt-1">
                {user?.role === 'customer' && 'Discover fresh produce from local farmers.'}
                {user?.role === 'farmer' && 'Manage your products and track your orders.'}
                {user?.role === 'admin' && 'Monitor platform activity and manage users.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="card p-6 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl border-2 ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
