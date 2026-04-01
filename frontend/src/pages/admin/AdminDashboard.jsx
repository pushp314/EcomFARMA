import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'farmers', 'customers', 'orders'
  
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

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800">Admin Control Center</h1>
          <p className="text-gray-500 mt-1">Manage platform operations and multivendor approvals.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {['overview', 'farmers', 'customers', 'orders'].map(tab => (
            <button
              key={tab}
              className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : activeTab === 'overview' && stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-card">
            <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">₹{stats.revenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-card">
            <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-card">
            <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Products</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalProducts || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-card">
            <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Registered Users</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers || 0}</p>
          </div>
        </div>
      ) : activeTab === 'farmers' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Farmer Name</th>
                  <th className="px-6 py-4 font-semibold">Farm Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.farmName || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleApprove(user.id, user.isApproved)} 
                        className={`text-sm font-medium ${user.isApproved ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                      >
                        {user.isApproved ? 'Suspend' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'customers' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Customer</p>
                  <p className="font-medium text-gray-800">{order.customer?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
                  <p className="font-bold text-green-700">₹{order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Items</p>
                  <p className="text-sm text-gray-800">{order.items.length} items</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
