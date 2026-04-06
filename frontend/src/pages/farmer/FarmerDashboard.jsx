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
  HiOutlineTrendingUp,
  HiOutlineExclamation,
  HiOutlineSearch,
  HiOutlineChevronRight,
  HiOutlineCheckCircle
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

  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState('');

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
        const { data: pData } = await productAPI.getFarmerProducts();
        setProducts(pData.products);
        // Also fetch stats for the quick-view badges if on inventory
        const { data: sData } = await orderAPI.getFarmerStats();
        setStats(sData.stats);
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
        toast.success('Inventory Updated');
      } else {
        await productAPI.create(payload);
        toast.success('Product Published Live');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Permanently delist this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Produce De-listed');
        fetchData();
      } catch (error) {
        toast.error('Action failed');
      }
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success(`Logistics: Set to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Signal lost');
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center p-6 bg-cream/30">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center max-w-xl animate-fade-in relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:rotate-12 transition-transform duration-700">📦</div>
           <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-8 ring-orange-50/50">
              <span className="text-5xl animate-bounce">🌾</span>
           </div>
           <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Verification in Progress</h2>
           <p className="text-gray-500 leading-relaxed text-lg font-medium">
             Our curators are currently reviewing your farm profile. You'll receive a notification once your digital storefront is ready for global distribution.
           </p>
           <div className="mt-10 flex gap-2 justify-center">
              {[0, 1, 2].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-orange-500 animate-pulse' : 'bg-orange-100'}`}></div>)}
           </div>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`flex items-center gap-2.5 px-8 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
        activeTab === id 
          ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 -translate-y-1' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-primary-600'
      }`}
    >
      <Icon className="text-lg" />
      <span className="uppercase tracking-widest">{label}</span>
    </button>
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      <div className="container-custom py-12 lg:py-16">
        <header className="flex flex-wrap justify-between items-start gap-8 mb-16">
           <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                 <HiOutlineCheckCircle className="text-primary-600" />
                 <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em]">Authorized Merchant Hub</p>
              </div>
              <h1 className="text-5xl font-display font-bold text-gray-900 mb-2 leading-tight tracking-tight">Marketplace OPS</h1>
              <p className="text-gray-400 font-medium text-lg">Inventory & Logistics for {user.farmName || user.name}</p>
           </div>

           <div className="flex flex-col gap-6">
              <div className="flex bg-white p-2 rounded-[2rem] shadow-xl shadow-gray-200/20 border border-gray-100 ring-1 ring-black/[0.02]">
                <TabButton id="inventory" icon={HiOutlineCube} label="Logistics" />
                <TabButton id="orders" icon={HiOutlineClipboardList} label="Fulfillment" />
                <TabButton id="analytics" icon={HiOutlinePresentationChartLine} label="Strategy" />
              </div>
              
              {activeTab !== 'analytics' && (
                <div className="relative group animate-slide-left">
                  <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Quick search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 pl-14 pr-8 py-3.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-600/10 outline-none font-medium text-sm transition-all"
                  />
                </div>
              )}
           </div>
        </header>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
             <LoadingSpinner />
             <p className="text-xs font-bold text-gray-300 uppercase tracking-widest animate-pulse">Syncing Merchant Records...</p>
          </div>
        ) : activeTab === 'analytics' && stats ? (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Volume', value: `₹${stats.totalEarnings?.toLocaleString()}`, icon: HiOutlineTrendingUp, color: 'primary' },
                  { label: 'Units Dispatched', value: stats.totalItemsSold, icon: HiOutlineClipboardList, color: 'blue' },
                  { label: 'Live Listings', value: stats.activeProducts, icon: HiOutlineCube, color: 'indigo' },
                  { label: 'Stock Critical', value: stats.lowStockCount, icon: HiOutlineExclamation, color: stats.lowStockCount > 0 ? 'rose' : 'emerald' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:-translate-y-1 transition-all duration-500">
                     <div className={`w-14 h-14 bg-${card.color}-50 rounded-2xl flex items-center justify-center text-${card.color}-600 mb-6`}>
                        <card.icon className="text-2xl" />
                     </div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                     <h3 className="text-3xl font-display font-bold text-gray-900 tracking-tight">{card.value}</h3>
                  </div>
                ))}
             </div>

             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                   <HiOutlinePresentationChartLine className="text-[12rem] text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-10 relative">Revenue Growth Model</h3>
                <div className="h-[350px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        ) : activeTab === 'inventory' ? (
          <div className="space-y-8">
             <div className="flex justify-between items-center bg-white p-4 pl-10 pr-6 rounded-[2rem] shadow-xl shadow-gray-200/10 border border-gray-100">
               <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Catalog Management</h2>
                  <p className="text-xs text-gray-400 mt-1">{filteredProducts.length} items registered live</p>
               </div>
               <button onClick={() => setShowForm(true)} className="flex items-center gap-3 btn-primary py-3.5 px-8 rounded-2xl shadow-xl shadow-primary-600/30 hover:scale-105 transition-all">
                 <HiOutlinePlus className="text-lg" />
                 <span className="text-xs font-bold uppercase tracking-widest">Add Item</span>
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden group hover:border-primary-600/20 transition-all duration-500">
                     <div className="h-60 relative overflow-hidden">
                       <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={() => handleEditClick(product)} className="w-12 h-12 bg-white text-primary-600 rounded-2xl shadow-lg hover:scale-110 transition-transform"><HiOutlinePencilAlt className="text-xl mx-auto" /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="w-12 h-12 bg-rose-500 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"><HiOutlineTrash className="text-xl mx-auto" /></button>
                       </div>
                       <div className="absolute top-6 left-6">
                         <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm ring-1 ring-black/5">{product.category}</span>
                       </div>
                     </div>
                     <div className="p-10">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className="font-display font-bold text-gray-900 text-2xl mb-1">{product.name}</h3>
                              <p className="text-xs text-gray-400 truncate w-40">{product.description || 'No description provided'}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-display font-bold text-primary-700 leading-none">₹{product.price}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">per {product.unit}</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                           <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 animate-pulse shadow-rose-500/30' } shadow-lg`}></div>
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Allocation: {product.stock} {product.unit}</span>
                           </div>
                           {product.stock < 10 && (
                             <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1"><HiOutlineExclamation /> RESTOCK</span>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             {products.length === 0 && (
               <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                     <HiOutlineCube className="text-4xl" />
                  </div>
                  <p className="text-gray-400 font-medium text-lg mb-6">Your digital storefront is empty.</p>
                  <button onClick={() => setShowForm(true)} className="btn-primary py-3 px-10 rounded-2xl text-xs font-bold uppercase tracking-widest">Initial Listing</button>
               </div>
             )}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up max-w-5xl mx-auto">
             {orders.map(order => (
               <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden p-8 hover:border-primary-600/20 transition-all duration-500 group">
                  <div className="flex flex-wrap items-center justify-between gap-10">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors duration-500 ring-1 ring-gray-100 group-hover:ring-primary-100">
                          <HiOutlineClipboardList className="text-3xl" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">ID: TRACK-{order.id.slice(-8).toUpperCase()}</p>
                           <h4 className="font-display font-bold text-gray-900 text-xl">{order.customer?.name}</h4>
                        </div>
                     </div>

                     <div className="flex-1 min-w-[240px]">
                        <div className="flex gap-2.5 flex-wrap">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 group-hover:border-primary-100 transition-all flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-800">{item.product?.name}</span>
                                <span className="text-[10px] font-bold text-primary-600 shadow-sm">×{item.quantity}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative">
                          <select 
                            className={`text-[10px] font-bold uppercase tracking-[0.1em] border-none rounded-2xl px-6 py-3.5 cursor-pointer focus:ring-0 shadow-sm appearance-none pr-12
                              ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 
                                order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' : 
                                'bg-emerald-50 text-emerald-600'}`}
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <HiOutlineChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-current pointer-events-none rotate-90" />
                        </div>

                        <div className="text-right min-w-[120px]">
                           <p className="text-3xl font-display font-bold text-gray-900 leading-none mb-1">₹{order.totalAmount}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
             {orders.length === 0 && (
               <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                     <HiOutlineClipboardList className="text-4xl" />
                  </div>
                  <p className="text-gray-400 font-medium italic">Your fulfillment backlog is clear.</p>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Product Form Modal (Add/Edit) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl transition-all" onClick={resetForm}></div>
           <div className="relative bg-white w-full max-w-3xl rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] p-10 md:p-14 max-h-[90vh] overflow-y-auto animate-zoom-in border border-white/20">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">{editingProduct ? 'Update Publication' : 'New Listing'}</h3>
                    <p className="text-sm text-gray-400 font-medium">Configure item parameters for the global marketplace.</p>
                 </div>
                 <button onClick={resetForm} className="w-12 h-12 bg-gray-50 rounded-2xl hover:bg-gray-100 hover:rotate-90 transition-all flex items-center justify-center text-gray-400">✕</button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Trade Name</label>
                       <input required type="text" placeholder="e.g. Organic Alphonso Mango" className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Market Classification</label>
                       <select className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Listing Price (₹)</label>
                       <input required type="number" placeholder="0.00" className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Stock Quant</label>
                          <input required type="number" placeholder="50" className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Metrics</label>
                          <select className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all appearance-none" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                             <option value="kg">kg</option>
                             <option value="g">gram</option>
                             <option value="pieces">unit</option>
                             <option value="liters">liter</option>
                             <option value="dozens">dozen</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Item Catalog Info</label>
                    <textarea required placeholder="Detailed provenance and nutritional information..." className="w-full bg-gray-50/50 border-gray-100 border rounded-2xl py-4 px-6 h-32 focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600 outline-none font-medium transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] ml-1">Visual Asset {editingProduct && '(Immutable if left empty)'}</label>
                    <div className="flex items-center gap-10 p-10 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 transition-all hover:border-primary-600/20 group/upload cursor-pointer relative overflow-hidden">
                       {imagePreview ? (
                         <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 border-4 border-white shadow-2xl relative z-10">
                            <img src={imagePreview} className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="w-32 h-32 bg-white rounded-3xl shrink-0 flex flex-col items-center justify-center text-gray-200 border border-gray-100 shadow-sm relative z-10 transition-all group-hover/upload:text-primary-600">
                            <HiOutlinePlus className="text-4xl" />
                         </div>
                       )}
                       <div className="relative z-10">
                          <h4 className="font-bold text-gray-900 mb-1">Select High-Res Image</h4>
                          <p className="text-xs text-gray-400">PNG, JPG or WEBP (Max 5MB)</p>
                       </div>
                       <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileSelect} />
                    </div>
                 </div>

                 <div className="pt-8">
                    <button disabled={uploading} className="w-full btn-primary py-5 rounded-[2rem] shadow-2xl shadow-primary-600/40 font-bold text-sm uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                       {uploading ? (
                         <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Syncing Pipeline...</span>
                         </>
                       ) : (
                         <span>{editingProduct ? 'Commit Updates' : 'Sync Live Listing'}</span>
                       )}
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
