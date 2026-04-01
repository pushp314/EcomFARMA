import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productAPI, orderAPI, uploadAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  HiOutlineCube, 
  HiOutlineClipboardList, 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencilAlt,
  HiOutlinePresentationChartLine,
  HiOutlineTrendingUp
} from 'react-icons/hi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Vegetables',
    unit: 'kg',
    stock: '',
  });

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Others'];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const { data } = await orderAPI.getFarmerStats();
        setStats(data.stats);
      } else if (activeTab === 'inventory') {
        const { data } = await productAPI.getFarmerProducts();
        setProducts(data.products);
      } else if (activeTab === 'orders') {
        const { data } = await orderAPI.getFarmerOrders();
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'Vegetables', unit: 'kg', stock: '' });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      unit: product.unit,
      stock: product.stock,
    });
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = editingProduct ? editingProduct.image : '';

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('image', selectedFile);
        const { data } = await uploadAPI.uploadImage(fileData);
        imageUrl = data.url;
      }

      const payload = { ...formData, image: imageUrl };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product listed live!');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Remove this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product removed');
        fetchData();
      } catch (error) {
        toast.error('Action failed');
      }
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success(`Success! Status changed to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="h-[80vh] flex items-center justify-center container-custom">
        <div className="bg-white p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center max-w-lg animate-fade-in">
           <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl animate-pulse">🌾</span>
           </div>
           <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Awaiting Verification</h2>
           <p className="text-gray-500 leading-relaxed">
             Our team is currently reviewing your farmer credentials. Once authorized, you'll be able to publish your harvest and manage orders globally.
           </p>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
        activeTab === id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <Icon className="text-lg" />
      {label}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <header className="flex flex-wrap justify-between items-end gap-6 mb-12">
           <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Farmer Hub</p>
              <h1 className="text-4xl font-display font-bold text-gray-900 leading-tight">Harvest Board</h1>
              <p className="text-gray-500">Welcome back, {user.farmName || user.name}</p>
           </div>

           <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <TabButton id="inventory" icon={HiOutlineCube} label="Market Stock" />
              <TabButton id="orders" icon={HiOutlineClipboardList} label="Incoming Orders" />
              <TabButton id="analytics" icon={HiOutlinePresentationChartLine} label="Sales Data" />
           </div>
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
        ) : activeTab === 'analytics' && stats ? (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                   <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                      <HiOutlineTrendingUp className="text-3xl" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Lifetime Earnings</p>
                      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">₹{stats.totalEarnings?.toLocaleString()}</h3>
                   </div>
                </div>
                {/* Visual Placeholder for more stats */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                   <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl">📦</div>
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Performance Index</p>
                      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Top Merchant</h3>
                   </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-8">Monthly Earnings Growth</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        ) : activeTab === 'inventory' ? (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-4 pr-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="font-bold text-gray-900 ml-4">Stock Management ({products.length})</h2>
               <button onClick={() => setShowForm(true)} className="flex items-center gap-2 btn-primary py-2.5 px-6 rounded-xl shadow-lg shadow-primary-500/20">
                 <HiOutlinePlus className="text-lg" />
                 Add Produce
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                     <div className="h-48 relative overflow-hidden">
                       <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                       <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => handleEditClick(product)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-primary-600 hover:bg-primary-600 hover:text-white transition-all"><HiOutlinePencilAlt /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all"><HiOutlineTrash /></button>
                       </div>
                     </div>
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                              <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-1 rounded font-bold uppercase tracking-widest">{product.category}</span>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-bold text-primary-700">₹{product.price}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">/{product.unit}</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                              <span className="text-xs text-gray-500 font-medium">Stock: {product.stock} {product.unit}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             {products.length === 0 && <div className="py-20 text-center bg-white rounded-3xl border border-gray-50 text-gray-400 italic font-medium tracking-wide shadow-sm shadow-gray-100">Your marketplace inventory is currently empty.</div>}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
             {orders.map(order => (
               <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 hover:border-primary-100 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                          <HiOutlineClipboardList className="text-2xl" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">#{order.id.slice(-6)}</p>
                           <h4 className="font-bold text-gray-900 text-lg">{order.customer?.name}</h4>
                        </div>
                     </div>

                     <div className="flex-1 min-w-[200px]">
                        <div className="flex gap-2 flex-wrap">
                           {order.items.map((item, idx) => (
                             <span key={idx} className="text-xs px-3 py-1.5 bg-gray-50 rounded-xl text-gray-600 font-medium border border-gray-100">{item.product?.name} × {item.quantity}</span>
                           ))}
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <select 
                          className={`text-sm font-bold border-none rounded-2xl px-4 py-2 cursor-pointer focus:ring-0
                            ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 
                              order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 
                              'bg-green-50 text-green-700'}`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        <div className="text-right min-w-[80px]">
                           <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
             {orders.length === 0 && <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 italic text-gray-400">No active orders found in your backlog.</div>}
          </div>
        )}
      </div>

      {/* Product Form Modal (Add/Edit) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetForm}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto animate-zoom-in">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Listing' : 'Publish Produce'}</h3>
                    <p className="text-sm text-gray-500">Provide accurate details for shoppers.</p>
                 </div>
                 <button onClick={resetForm} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">✕</button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                       <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                       <select className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                       <input required type="number" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                          <input required type="number" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                          <select className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 cursor-pointer" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                             <option value="kg">kg</option>
                             <option value="g">g</option>
                             <option value="pieces">pcs</option>
                             <option value="liters">L</option>
                             <option value="dozens">dz</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Description</label>
                    <textarea required className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 h-32 focus:ring-2 focus:ring-primary-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Display Image {editingProduct && '(Leave empty to keep current)'}</label>
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                       {imagePreview && (
                         <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white shadow-sm">
                            <img src={imagePreview} className="w-full h-full object-cover" />
                         </div>
                       )}
                       <input type="file" accept="image/*" className="text-xs text-gray-500 cursor-pointer" onChange={handleFileSelect} />
                    </div>
                 </div>

                 <div className="pt-6">
                    <button disabled={uploading} className="w-full btn-primary py-4 rounded-2xl shadow-xl shadow-primary-500/20 font-bold tracking-wide">
                       {uploading ? 'Processing Harvest...' : (editingProduct ? 'Save Updates' : 'Publish Direct Listing')}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
