import { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  HiOutlineViewGrid, 
  HiOutlineUserGroup, 
  HiOutlineShoppingBag, 
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrendingUp,
  HiOutlineUsers,
  HiOutlineTrash,
  HiOutlineAdjustments,
  HiOutlineSearch,
  HiOutlineExternalLink
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      } else if (activeTab === 'products') {
        const { data } = await adminAPI.getAdminProducts();
        setProducts(data.products);
      }
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      await adminAPI.toggleApproveFarmer(id, { isApproved: !currentStatus });
      toast.success(currentStatus ? 'Access Suspended' : 'Farmer Verified');
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Permanently remove ${name} from platform?`)) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('Account purged');
        fetchData();
      } catch (error) {
        toast.error('Purge failed');
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product listing?')) {
      try {
        await productAPI.delete(id);
        toast.success('Listing removed');
        fetchData();
      } catch (error) {
        toast.error('Action aborted');
      }
    }
  };

  const handleUpdateOrder = async (id, status) => {
    try {
      await adminAPI.updateOrder(id, { status });
      toast.success(`Order set to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const COLORS = ['#10b981', '#3b82f6'];

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 font-bold scale-105' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-primary-600'
      }`}
    >
      <Icon className="text-xl" />
      <span className="hidden md:inline text-sm">{label}</span>
    </button>
  );

  const filteredItems = (items, key) => {
    return items.filter(item => 
      (item[key] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 md:w-72 bg-white border-r border-gray-100 p-6 flex flex-col gap-2 sticky top-0 h-screen z-20">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
            <HiOutlineAdjustments className="text-xl" />
          </div>
          <div className="hidden md:block">
            <h2 className="font-display font-bold text-gray-900 leading-none">Console</h2>
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1">v2.4.0 Extended</p>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem id="overview" icon={HiOutlineViewGrid} label="Control Center" />
          <div className="pt-6 pb-2 px-4">
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] hidden md:block">Directory</p>
          </div>
          <SidebarItem id="farmers" icon={HiOutlineUserGroup} label="Farmer Network" />
          <SidebarItem id="customers" icon={HiOutlineUsers} label="Membership" />
          <SidebarItem id="products" icon={HiOutlineShoppingBag} label="Catalog Hub" />
          <SidebarItem id="orders" icon={HiOutlineClipboardList} label="Logistics" />
        </nav>
        
        <div className="mt-auto pt-8">
          <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden hidden md:block group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/40 transition-all duration-700"></div>
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2">Cloud Core</p>
            <h4 className="font-bold text-sm mb-4">Storage Priority</h4>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-primary-500 h-full w-[65%]" />
            </div>
            <p className="text-[10px] text-gray-400">6.2 GB of 10 GB utilized</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 lg:p-12">
        <header className="flex flex-wrap justify-between items-start gap-6 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">System Status: Active</p>
            </div>
            <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight capitalize">
              {activeTab === 'overview' ? 'Operational Insight' : activeTab.replace('-', ' ')}
            </h1>
          </div>

          {activeTab !== 'overview' && (
            <div className="relative w-full md:w-80 group animate-slide-left">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          )}
        </header>

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
             <LoadingSpinner />
             <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Encrypted Records...</p>
          </div>
        ) : activeTab === 'overview' && stats ? (
          <div className="space-y-10 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Platform Revenue', value: `₹${stats.revenue?.toLocaleString()}`, icon: HiOutlineTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', shadow: 'shadow-emerald-500/10' },
                { label: 'Global Orders', value: stats.totalOrders, icon: HiOutlineClipboardList, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', shadow: 'shadow-blue-500/10' },
                { label: 'Merchant Network', value: stats.totalFarmers, icon: HiOutlineUserGroup, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', shadow: 'shadow-indigo-500/10' },
                { label: 'Active Consumerbase', value: stats.totalCustomers, icon: HiOutlineUsers, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', shadow: 'shadow-orange-500/10' },
              ].map((card, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border ${card.bg} ${card.shadow} shadow-xl group hover:-translate-y-1 transition-all duration-500 bg-white`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 leading-none">{card.label}</p>
                       <h3 className="text-3xl font-display font-bold text-gray-900 tracking-tight leading-none">{card.value}</h3>
                     </div>
                     <div className={`p-3.5 rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.03] transition-transform group-hover:rotate-12 ${card.color}`}>
                       <card.icon className="text-2xl" />
                     </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                   <HiOutlineTrendingUp className="text-[12rem] -rotate-12" />
                </div>
                <div className="flex justify-between items-center mb-10 relative">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">Revenue Growth Analytics</h3>
                    <p className="text-xs text-gray-400 font-medium">Aggregated platform income over the previous 6 reporting cycles.</p>
                  </div>
                  <div className="flex bg-gray-50 p-1 rounded-xl">
                     <button className="px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg bg-white shadow-sm text-primary-600">6 Months</button>
                     <button className="px-4 py-1.5 text-[10px] font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors">1 Year</button>
                  </div>
                </div>
                <div className="h-[350px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                      <Tooltip 
                        cursor={{stroke: '#10b981', strokeWidth: 1}}
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                        itemStyle={{fontWeight: 700, fontSize: '14px'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent pointer-events-none"></div>
                <h3 className="text-xl font-bold mb-2 relative">Market Share</h3>
                <p className="text-xs text-gray-400 mb-10 relative">Demographic distribution across the ecosystem.</p>
                
                <div className="h-[260px] w-full relative group">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Farmers', value: stats.totalFarmers },
                          { name: 'Customers', value: stats.totalCustomers }
                        ]}
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        className="outline-none"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-display font-bold">{stats.totalUsers}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] mt-1">Total Users</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4 relative">
                  {[
                    { label: 'Merchant Network', value: stats.totalFarmers, color: 'bg-emerald-500' },
                    { label: 'Authorized Shoppers', value: stats.totalCustomers, color: 'bg-blue-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/50`}></div>
                         <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">{item.label}</span>
                      </div>
                      <span className="font-display font-bold text-lg">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'farmers' || activeTab === 'customers' ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#fafbfc] border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Identity Profile</th>
                    <th className="px-10 py-6">Digital Contact</th>
                    {activeTab === 'farmers' && <th className="px-10 py-6">Network Authorization</th>}
                    <th className="px-10 py-6 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {filteredItems(users, 'name').map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                           <div className="relative">
                              <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all" />
                              {user.isApproved && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-400 font-medium">{user.farmName || 'Active Consumer Account'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                         <p className="text-sm font-medium text-gray-600">{user.email}</p>
                         <p className="text-[10px] text-gray-400 mt-1">{user.phone || 'No Phone Verified'}</p>
                      </td>
                      {activeTab === 'farmers' && (
                        <td className="px-10 py-7">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.isApproved ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                            {user.isApproved ? 'Verified Merchant' : 'Review Required'}
                          </span>
                        </td>
                      )}
                      <td className="px-10 py-7">
                        <div className="flex justify-end items-center gap-3">
                           {activeTab === 'farmers' && (
                             <button 
                               onClick={() => handleToggleApprove(user.id, user.isApproved)} 
                               title={user.isApproved ? 'Deactivate Access' : 'Authorize Merchant'}
                               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.isApproved ? 'text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white' : 'text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white'}`}
                             >
                               {user.isApproved ? <HiOutlineXCircle className="text-xl" /> : <HiOutlineCheckCircle className="text-xl" />}
                             </button>
                           )}
                           <button 
                             onClick={() => handleDeleteUser(user.id, user.name)}
                             title="Purge Account Data"
                             className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                           >
                             <HiOutlineTrash className="text-xl" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="py-24 text-center">
                 <p className="text-gray-400 italic">No ecosystem records match your current criteria.</p>
              </div>}
            </div>
          </div>
        ) : activeTab === 'products' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
             {filteredItems(products, 'name').map(product => (
               <div key={product.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
                  <div className="h-56 relative overflow-hidden">
                     <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <div className="w-full flex justify-between items-center">
                           <button onClick={() => handleDeleteProduct(product.id)} className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><HiOutlineTrash className="text-xl" /></button>
                           <a href={`/product/${product.id}`} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white text-gray-900 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><HiOutlineExternalLink className="text-xl" /></a>
                        </div>
                     </div>
                     <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm ring-1 ring-black/5">{product.category}</span>
                     </div>
                  </div>
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-gray-900 text-xl mb-1">{product.name}</h4>
                           <p className="text-xs text-gray-400 font-medium">Merchant: <span className="text-primary-600">{product.farmer?.farmName || product.farmer?.name}</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-display font-bold text-primary-700">₹{product.price}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">per {product.unit}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 pt-6 border-t border-gray-50">
                        <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 animate-pulse shadow-rose-500/20 shadow-lg'} shadow-md`}></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Allocation: {product.stock} {product.unit}</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid gap-6 animate-slide-up max-w-5xl mx-auto">
            {filteredItems(orders, 'id').map(order => (
              <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 group hover:border-primary-500/20 transition-all duration-500">
                <div className="flex flex-wrap items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-500 ring-1 ring-gray-100 group-hover:ring-primary-100">
                       <HiOutlineClipboardList className="text-3xl" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">Transaction Trace: #{order.id.slice(-8).toUpperCase()}</p>
                       <p className="font-display font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">{order.customer?.name}</p>
                     </div>
                   </div>
                   
                   <div className="flex-1 min-w-[300px]">
                      <div className="flex gap-2.5 flex-wrap">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-primary-100 transition-colors">
                             <span className="text-xs font-bold text-gray-800">{item.product.name}</span>
                             <span className="text-[10px] font-bold text-primary-600">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 4 && <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">+{order.items.length - 4} More</div>}
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-2xl font-display font-bold text-gray-900 leading-none mb-1">₹{order.totalAmount}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrder(order.id, e.target.value)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-none cursor-pointer focus:ring-0 shadow-sm
                        ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                          'bg-orange-50 text-orange-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                   </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="py-32 text-center">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <HiOutlineClipboardList className="text-5xl" />
               </div>
               <p className="text-gray-400 font-medium italic">No logistical records found in global history.</p>
            </div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
