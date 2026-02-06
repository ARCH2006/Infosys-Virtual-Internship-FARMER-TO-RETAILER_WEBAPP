import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, PlusCircle, ShoppingCart,
    CreditCard, BarChart3, User, LogOut, Bell, Wallet, Info
} from 'lucide-react';
import { apiService } from '../../services/api.service';
import AddProductForm from './AddProductForm';
import NotificationSidebar from './NotificationSidebar';

const FarmerDashboard = ({ user, onLogout }) => {
    console.log("Current Logged In User:", user);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalProducts: 0, activeOrders: 0, earnings: 0, stockAlerts: 0
    });
    const [orders, setOrders] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const recentOrders = orders.slice(0, 5);

    // Notification Loading Logic
    const loadNotifications = async () => {
        if (!user?.id) return;
        try {
            const data = await apiService.get(`/notifications/user/${user.id}`);
            setNotifications(data);
        } catch (err) {
            console.error("Notifications not available yet:", err.message);
        }
    };

    useEffect(() => {
        loadNotifications();
        if (user?.id) {
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-products', label: 'My Products', icon: Package },
        { id: 'add-product', label: 'Add Product', icon: PlusCircle },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'inventory', label: 'Inventory', icon: Info },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const loadFarmerData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const statsData = await apiService.get(`/products/stats/${user.id}`);
            const productData = await apiService.get(`/products/my-inventory/${user.id}`);
            const orderData = await apiService.getFarmerOrders(user.id);

            setProducts(productData);
            setOrders(orderData);

            const totalEarnings = orderData
                .filter(o => o.status === 'COMPLETED')
                .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            const activeCount = orderData.filter(o =>
                !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(o.status)
            ).length;

            setStats({
                totalProducts: statsData.totalProducts || 0,
                activeOrders: activeCount,
                earnings: totalEarnings,
                stockAlerts: statsData.lowStockCount || 0
            });
        } catch (err) {
            console.error("Failed to load farmer data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        let pickupAddress = null;

        // Ask for location only when starting to process the order
        if (newStatus === 'ACCEPTED') {
            pickupAddress = prompt("Please enter the specific Pickup Address for this order:");
            if (!pickupAddress) {
                alert("Pickup address is required to accept the order.");
                return;
            }
        }

        try {
            // Update your API call to include the pickupAddress in the query params
            const url = `/orders/${orderId}/status?status=${newStatus}${pickupAddress ? `&pickupAddress=${encodeURIComponent(pickupAddress)}` : ''}`;
            await apiService.put(url);

            alert(`Order ${newStatus.toLowerCase()} successfully!`);
            loadFarmerData();
        } catch (err) {
            alert("Action failed: " + err.message);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadFarmerData();
        }
    }, [user?.id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <DashboardCard title="Total Products" value={stats.totalProducts} icon={Package} color="bg-blue-500" />
                            <DashboardCard title="Active Orders" value={stats.activeOrders} icon={ShoppingCart} color="bg-green-500" />
                            <DashboardCard title="Earnings" value={`₹${stats.earnings}`} icon={CreditCard} color="bg-yellow-500" />
                            <DashboardCard title="Stock Alerts" value={stats.stockAlerts} icon={Info} color="bg-red-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                    <ShoppingCart size={18}/> Recent Orders
                                </h3>
                                <div className="space-y-4">
                                    {recentOrders.length > 0 ? recentOrders.map(o => (
                                        <div key={o.id} className="flex justify-between items-center text-sm border-b pb-2">
                                            <div>
                                                <span className="font-bold">Order #{o.id}</span>
                                                <p className="text-gray-400 text-xs">{o.status}</p>
                                            </div>
                                            <span className="font-black text-green-600">₹{o.totalAmount}</span>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                                            No recent orders found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                    <BarChart3 size={18}/> Sales Analytics
                                </h3>
                                <div className="h-48 flex items-end justify-between px-4 gap-2">
                                    {[40, 70, 45, 90, 65, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-green-200 rounded-t-lg hover:bg-green-500 transition-all cursor-pointer" style={{height: `${h}%`}}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'my-products':
            case 'inventory':
                return (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Product Inventory</h2>
                            <button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                <PlusCircle size={18} /> Add New
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-gray-700">
                                    {products.length > 0 ? products.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border">
                                                    {prod.imagePath ? (
                                                        <img src={`http://localhost:8080${prod.imagePath}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="m-auto text-gray-400 mt-2" size={20} />
                                                    )}
                                                </div>
                                                <span className="font-medium">{prod.name}</span>
                                            </td>
                                            <td className="px-6 py-4">{prod.category}</td>
                                            <td className="px-6 py-4">₹{prod.price} / {prod.unit}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {prod.stock} {prod.unit}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No products found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'add-product':
                return <AddProductForm user={user} onSuccess={() => { loadFarmerData(); setActiveTab('my-products'); }} />;

            case 'orders':
                return (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Order ID & Date</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Farmer Share (90%)</th>
                                        <th className="px-6 py-4 text-center">Live Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No orders received yet.</td></tr>
                                    ) : (
                                        orders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">#{order.id}</div>
                                                    <div className="text-[10px] text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.orderItems.map(item => (
                                                        <div key={item.id} className="text-xs font-medium text-gray-600">
                                                            {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-green-600">₹{(order.totalAmount * 0.9).toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400">After 10% Admin Fee</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                                        order.status === 'PENDING' ? 'bg-blue-50 text-blue-600' :
                                                        order.status === 'PROCESSING' ? 'bg-yellow-50 text-yellow-700' :
                                                        order.status === 'READY_FOR_PICKUP' ? 'bg-indigo-50 text-indigo-600' :
                                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {order.status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {order.status === 'PENDING' && (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')} className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-green-700">Accept</button>
                                                                <button onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="text-red-500 text-[10px] font-bold hover:underline">Reject</button>
                                                            </>
                                                        )}
                                                        {order.status === 'ACCEPTED' && (
                                                            <button onClick={() => handleStatusUpdate(order.id, 'PROCESSING')} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-yellow-600">Start Packing</button>
                                                        )}
                                                        {order.status === 'PROCESSING' && (
                                                            <button onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-600">Mark Ready</button>
                                                        )}
                                                        {order.status === 'READY_FOR_PICKUP' && <span className="text-[10px] text-indigo-600 font-bold animate-pulse">Waiting for Pickup...</span>}
                                                        {order.status === 'COMPLETED' && <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CreditCard size={12}/> Paid</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white p-20 text-center rounded-2xl border border-dashed">
                        <h2 className="text-2xl font-bold text-gray-300 capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>
                );
        }
    };

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <>
            <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
                <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
                    <div className="p-6 border-b font-bold text-xl text-green-600 flex items-center gap-2">
                        <Package /> Farmer Portal
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    activeTab === item.id ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                            <LogOut size={20} /> <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col h-full overflow-hidden">
                    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm z-10">
                        <div className="text-gray-700 font-medium">
                            Welcome, <span className="text-green-600 font-bold underline capitalize">{user.username}</span>
                        </div>
                        <div className="flex items-center gap-8 text-gray-500">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-green-600"><Wallet size={18}/> <span>Wallet</span></div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-green-600 relative" onClick={() => setIsNotifOpen(true)}>
                                <Bell size={18}/>
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {notifications.filter(n => !n.isRead).length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                        ) : renderTabContent()}
                    </div>
                </main>
            </div>
            <NotificationSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={notifications} />
        </>
    );
};

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-extrabold mt-2 text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-xl text-white ${color}`}><Icon size={24} /></div>
        </div>
    </div>
);

export default FarmerDashboard;