import { useState, useEffect } from 'react';
import { orderAPI } from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';

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

    if (loading) return <div className="py-20"><LoadingSpinner /></div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
                <p className="text-gray-500">When you place orders from the marketplace, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Order Placed</p>
                            <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                            <p className="font-medium text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                            <p className="font-medium text-gray-800 text-sm">#{order.id.split('-')[0]}</p>
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
                    
                    <div className="p-6">
                        <ul className="divide-y divide-gray-100">
                            {order.items.map(item => (
                                <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden bg-cover bg-center" style={{backgroundImage: `url(${item.product?.image})`}}></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{item.product?.name || 'Product unavailable'}</h4>
                                        <p className="text-sm text-gray-500">Bought from {item.product?.farmer?.farmName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerOrders;
