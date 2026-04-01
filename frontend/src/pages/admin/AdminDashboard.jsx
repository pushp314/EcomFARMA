import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  HiOutlineViewGrid, 
  HiOutlineUserGroup, 
  HiOutlineShoppingBag, 
  HiOutlineDocumentReport,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrendingUp,
  HiOutlineUsers,
} from 'react-icons/hi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const { data } = await adminAPI.getDashboardStats();
        setStats(data.stats);
      } else if (activeTab === 'farmers') {
        const { data } = await adminAPI.getUsers({ role: 'farmer' });
        setUsers(data.users);
      } else if (activeTab === 'customers') {
        const { data } = await adminAPI.getUsers({ role: 'customer' });
        setUsers(data.users);
      } else if (activeTab === 'orders') {
        const { data } = await adminAPI.getAllOrders();
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      await adminAPI.toggleApproveFarmer(id, { isApproved: !currentStatus });
      toast.success(currentStatus ? 'Farmer suspended' : 'Farmer approved');
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const COLORS = ['#16a34a', '#3b82f6'];

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-bold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'
      }`}
    >
      <Icon className="text-xl" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-white border-r border-gray-100 p-4 flex flex-col gap-2 pt-8 sticky top-0 h-screen">
        <div className="px-2 mb-8 hidden md:block">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Platform Hub</h2>
        </div>
        <SidebarItem id="overview" icon={HiOutlineViewGrid} label="Control Center" />
        <SidebarItem id="farmers" icon={HiOutlineUserGroup} label="Farmers Management" />
        <SidebarItem id="customers" icon={HiOutlineUsers} label="Customers" />
        <SidebarItem id="orders" icon={HiOutlineShoppingBag} label="Order Management" />
        
        <div className="mt-auto px-2 pb-4 hidden md:block">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-900 uppercase">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-hidden">
        <header className="mb-10">
          <h1 className="text-3xl font-display font-bold text-gray-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
          <p className="text-gray-500 mt-1">Real-time platform governance and marketplace oversight.</p>
        </header>

        {loading ? (
          <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>
        ) : activeTab === 'overview' && stats ? (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${stats.revenue?.toLocaleString()}`, icon: HiOutlineTrendingUp, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                { label: 'Global Orders', value: stats.totalOrders, icon: HiOutlineShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { label: 'Active Farmers', value: stats.totalFarmers, icon: HiOutlineUserGroup, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
                { label: 'Userbase Growth', value: stats.totalUsers, icon: HiOutlineUsers, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
              ].map((card, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${card.bg} shadow-sm group hover:scale-[1.02] transition-all duration-300`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-white shadow-sm transition-transform group-hover:rotate-12 ${card.color}`}>
                      <card.icon className="text-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Revenue Trajectory</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">Last 6 Months</span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Audience Distribution</h3>
                <div className="h-[240px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Farmers', value: stats.totalFarmers },
                          { name: 'Customers', value: stats.totalCustomers }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Users</span>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                       <span className="text-gray-600">Farmers</span>
                    </div>
                    <span className="font-bold">{stats.totalFarmers}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                       <span className="text-gray-600">Customers</span>
                    </div>
                    <span className="font-bold">{stats.totalCustomers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'farmers' || activeTab === 'customers' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Full Name / Farm</th>
                    <th className="px-8 py-5">Email Address</th>
                    {activeTab === 'farmers' && <th className="px-8 py-5">Verification</th>}
                    <th className="px-8 py-5 text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.farmName || 'No Business Name'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm">{user.email}</td>
                      {activeTab === 'farmers' && (
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isApproved ? 'Authorized' : 'Action Required'}
                          </span>
                        </td>
                      )}
                      <td className="px-8 py-5 text-right">
                        {activeTab === 'farmers' ? (
                          <button 
                            onClick={() => handleToggleApprove(user.id, user.isApproved)} 
                            className={`p-2 rounded-lg transition-all ${user.isApproved ? 'text-red-500 hover:bg-red-50' : 'text-primary-600 hover:bg-primary-50'}`}
                          >
                            {user.isApproved ? <HiOutlineXCircle className="text-xl" /> : <HiOutlineCheckCircle className="text-xl" />}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="py-12 text-center text-gray-400">No data records found.</div>}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 animate-slide-up">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 group hover:border-primary-100 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                       <HiOutlineShoppingBag className="text-2xl" />
                     </div>
                     <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Order #{order.id.slice(-6)}</p>
                       <p className="font-bold text-gray-900">{order.customer?.name}</p>
                     </div>
                   </div>
                   
                   <div className="flex-1 min-w-[200px]">
                      <div className="flex gap-2 flex-wrap">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-50 rounded-md text-gray-600 border border-transparent group-hover:border-gray-200">{item.product.name} × {item.quantity}</span>
                        ))}
                        {order.items.length > 3 && <span className="text-xs px-2 py-1 text-gray-400">+{order.items.length - 3} more</span>}
                      </div>
                   </div>

                   <div className="text-right">
                     <p className="text-xl font-bold text-gray-900">₹{order.totalAmount}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>

                   <div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                   </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="py-20 text-center text-gray-400 italic">Global order history is empty.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
