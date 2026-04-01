import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productAPI, orderAPI, uploadAPI } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); 
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // New product form state
  const [showAddForm, setShowAddForm] = useState(false);
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
      if (activeTab === 'products') {
        const { data } = await productAPI.getFarmerProducts();
        setProducts(data.products);
      } else {
        const { data } = await orderAPI.getFarmerOrders();
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = '';

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('image', selectedFile);
        const { data } = await uploadAPI.uploadImage(fileData);
        imageUrl = data.url;
      }

      await productAPI.create({ ...formData, image: imageUrl });
      
      toast.success('Product added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: '', category: 'Vegetables', unit: 'kg', stock: '' });
      setSelectedFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">Account Pending Approval</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Your farmer account is currently being reviewed by our administration team. 
          You will be able to add products and receive orders once approved.
        </p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            Welcome, {user.farmName || user.name}
          </h1>
          <p className="text-gray-500 mt-1">Manage your farm's inventory and customer orders.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('products')}
          >
            Inventory
          </button>
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">My Products</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary py-2 px-4"
            >
              {showAddForm ? 'Cancel' : '+ Add New Product'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-100 mb-8">
              <h3 className="font-bold text-green-800 mb-4">Add Fresh Produce</h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Product Name" className="input-field bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <select required className="input-field bg-white appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input required type="number" placeholder="Price (₹)" min="1" step="0.01" className="input-field bg-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <div className="flex gap-2">
                  <input required type="number" placeholder="Stock quantity" min="1" className="input-field bg-white flex-1" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  <select className="input-field bg-white w-24 appearance-none" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pieces">pcs</option>
                    <option value="liters">L</option>
                    <option value="dozens">dz</option>
                  </select>
                </div>
                
                {/* Image Upload Area */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Photo</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-200">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" 
                      onChange={handleFileSelect} 
                    />
                  </div>
                </div>

                <textarea required placeholder="Short description..." className="input-field bg-white md:col-span-2 py-3 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" disabled={uploading} className="btn-primary px-8 flex items-center gap-2">
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      'Publish Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 && !showAddForm ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-700 mb-2">No products added yet</h3>
              <p className="text-gray-500 mb-4">List your first farm produce to start selling directly to customers.</p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary py-2 px-6">Add Product</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-200 bg-cover" style={{backgroundImage: `url(${product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'})`}}></div>
                            {product.name}
                        </td>
                        <td className="px-6 py-4"><span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">{product.category}</span></td>
                        <td className="px-6 py-4 font-semibold text-green-700">₹{product.price} <span className="text-xs text-gray-500 font-normal">/{product.unit}</span></td>
                        <td className="px-6 py-4">{product.stock} {product.unit}</td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Customer Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500">When customers buy your products, they will appear here.</p>
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
                      <p className="text-xs text-gray-500 font-semibold uppercase">Contact</p>
                      <p className="text-sm text-gray-600">{order.customer?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Order Date</p>
                      <p className="text-sm text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <select 
                        className={`text-sm font-bold border-none rounded-lg focus:ring-2 px-3 py-1 cursor-pointer
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm">Products to package:</h4>
                    <ul className="divide-y divide-gray-50">
                      {order.items.map(item => (
                        <li key={item.id} className="py-2 flex justify-between">
                          <span>{item.quantity}x {item.product?.name}</span>
                          <span className="font-medium text-gray-600">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
