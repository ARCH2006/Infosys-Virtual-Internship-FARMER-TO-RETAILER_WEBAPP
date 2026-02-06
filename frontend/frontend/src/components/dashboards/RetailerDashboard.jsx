import React, { useState, useEffect, useMemo } from 'react';
import {
    ShoppingCart, Search, History, Package, XCircle,
    LayoutDashboard, List, MapPin, DollarSign, Clock, LogOut,
    User as UserIcon, Settings as SettingsIcon, TrendingUp, BarChart3,
    CheckCircle, Star, MessageSquare
} from 'lucide-react';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

import { apiService } from '../../services/api.service';
import { useNavigate } from 'react-router-dom';
import ProfileSection from '../retailer/ProfileSection.jsx';
import SettingsSection from '../retailer/SettingSection.jsx';
import FeedbackModal from './FeedbackModal';

const RetailerDashboard = ({ user, onLogout, cart }) => {
    const [products, setProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [stats, setStats] = useState({ ordersPlaced: 0, pendingDeliveries: 0, totalSpend: 0 });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [location, setLocation] = useState('');
    const [ratingData, setRatingData] = useState({ orderId: null, productId: null, rating: 5, comment: '' });

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) loadData();
    }, [user?.id]);

    const loadData = async () => {
        try {
            const [productData, orderList] = await Promise.all([
                apiService.getProducts(),
                apiService.getRetailerOrders(user.id)
            ]);

            setProducts(productData);
            setMyOrders(orderList);

            const totalSpend = orderList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
            const pending = orderList.filter(o => !['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(o.status)).length;

            setStats({
                ordersPlaced: orderList.length,
                pendingDeliveries: pending,
                totalSpend: totalSpend.toFixed(2)
            });
        } catch (err) {
            console.error("Failed to sync dashboard data", err);
        }
    };

    const handleRateSubmit = async (modalData) => {
        if (!ratingData.orderId || !ratingData.productId) {
            alert("Error: Missing order or product information.");
            return;
        }

        try {
            // Check if the order already has a rating to determine the method
            const currentOrder = myOrders.find(o => o.id === ratingData.orderId);

            const payload = {
                orderId: Number(ratingData.orderId),
                productId: Number(ratingData.productId),
                retailerId: Number(user.id),
                rating: modalData.rating,
                comment: modalData.comment
            };

            if (currentOrder?.hasRated) {
                // Use PUT to update existing review
                await apiService.put(`/feedback/update/${ratingData.orderId}`, payload);
                alert("Review updated successfully!");
            } else {
                // Use POST for a brand new review
                await apiService.post('/feedback/submit', payload);
                alert("Thank you for your feedback!");
            }

            setRatingData({ orderId: null, productId: null, rating: 5, comment: '' });
            await loadData();
        } catch (err) {
            console.error("Feedback Error:", err.response?.data);
            alert("Action failed: " + (err.response?.data?.message || "Server error"));
        }
    };

    const chartData = useMemo(() => {
        return myOrders
            .filter(o => o.status !== 'CANCELLED')
            .slice(-7)
            .map(o => ({
                name: new Date(o.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                amount: o.totalAmount
            }));
    }, [myOrders]);

    const categoryData = useMemo(() => {
        const counts = {};
        myOrders.forEach(o => {
            o.orderItems?.forEach(item => {
                const cat = item.product?.category || 'Other';
                counts[cat] = (counts[cat] || 0) + 1;
            });
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [myOrders]);

    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

    const filteredProducts = products.filter(p => {
        const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '' || (p.category && p.category.toLowerCase().includes(filterCategory.toLowerCase()));
        const matchesPrice = maxPrice === '' || p.price <= parseFloat(maxPrice);
        const matchesLocation = location === '' || (p.location && p.location.toLowerCase().includes(location.toLowerCase()));
        return matchesName && matchesCategory && matchesPrice && matchesLocation;
    });

    const getProgressWidth = (status) => {
        const steps = ['PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];
        const idx = steps.indexOf(status);
        return idx === -1 ? '0%' : `${((idx + 1) / steps.length) * 100}%`;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6 pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={<Package className="text-blue-500"/>} title="Total Orders" value={stats.ordersPlaced} trend="+12% from last month" />
                            <StatCard icon={<Clock className="text-yellow-500"/>} title="Pending Items" value={stats.pendingDeliveries} trend="Priority: High" />
                            <StatCard icon={<DollarSign className="text-green-500"/>} title="Total Investment" value={`₹${stats.totalSpend}`} trend="Avg. ₹2.4k/order" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-blue-600"/> Spending Analysis
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">Last 7 Orders</span>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-green-600"/> Order Mix
                                </h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {categoryData.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs">
                                            <span className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                                {item.name}
                                            </span>
                                            <span className="font-bold text-gray-700">{item.value} Orders</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <History size={20} className="text-blue-600" /> Recent Transactions
                                </h3>
                                <RecentOrdersTable orders={myOrders.slice(0, 5)} setRatingData={setRatingData} />
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <List size={20} className="text-green-600" /> Quick Stock View
                                </h3>
                                <QuickInventoryPreview products={products.slice(0, 5)} onBrowse={() => setActiveTab('browse')} />
                            </div>
                        </div>
                    </div>
                );
            case 'browse':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <select className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                <option value="Vegetable">Vegetable</option>
                                <option value="Fruit">Fruit</option>
                            </select>
                            <input type="number" placeholder="Max Price (₹)" className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setMaxPrice(e.target.value)} />
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="text" placeholder="Location..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                );
            case 'tracking':
                return (
                    <div className="bg-white rounded-xl shadow p-6 border animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <History className="text-blue-600" /> My Orders & Tracking
                        </h2>
                        <div className="space-y-4">
                            {myOrders.length > 0 ? myOrders.map(order => (
                                <div key={order.id} className="border border-gray-100 p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order ID: #{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    ['CANCELLED', 'REJECTED'].includes(order.status) ? 'bg-red-50 text-red-600' :
                                                    order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-50 text-orange-600' :
                                                    order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {order.orderItems?.map((item, idx) => (
                                                    <div key={idx} className="text-xs font-bold text-gray-700">
                                                        {item.product?.name} <span className="text-gray-400">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4">
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: getProgressWidth(order.status) }} />
                                                </div>
                                                <div className="flex justify-between text-[8px] font-black text-gray-400 mt-1 uppercase tracking-tighter">
                                                    <span>Placed</span>
                                                    <span>Packed</span>
                                                    <span>In Transit</span>
                                                    <span>Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400 font-black uppercase mb-1">Total Amount</p>
                                                <p className="text-xl font-black text-blue-600">₹{order.totalAmount || 0}</p>
                                            </div>
                                            <div className="mt-4">
                                                {order.status === 'OUT_FOR_DELIVERY' ? (
                                                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                                                        <p className="text-[9px] font-black text-orange-400 uppercase">Delivery OTP</p>
                                                        <p className="text-xl font-black text-orange-600 tracking-widest">{order.deliveryPin}</p>
                                                    </div>
                                                ) : order.status === 'PENDING' ? (
                                                    <button onClick={() => {/* handle cancel */}} className="text-red-500 text-xs font-bold hover:underline">Cancel Order</button>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 italic">Secure Delivery Enabled</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="text-center py-20 text-gray-400 italic">No orders found.</div>}
                        </div>
                    </div>
                );
            case 'reviews':
                const pendingReviews = myOrders.filter(o => o.status === 'COMPLETED' && !o.hasRated);
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border animate-in fade-in duration-500">
                        <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                            <Star className="text-yellow-400 fill-yellow-400" size={24} /> Pending Reviews
                        </h2>
                        <div className="grid gap-4">
                            {pendingReviews.length > 0 ? pendingReviews.map(order => (
                                <div key={order.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{order.id}</span>
                                        <p className="font-bold text-gray-800">{order.orderItems?.[0]?.product?.name || "Product Item"}</p>
                                    </div>
                                    <button
                                        onClick={() => setRatingData({
                                            orderId: order.id,
                                            productId: order.orderItems?.[0]?.product?.id,
                                            rating: 5,
                                            comment: ''
                                        })}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                                    >
                                        RATE NOW
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-20">
                                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                                    <p className="text-gray-400 font-bold italic">All orders have been rated!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'profile': return <ProfileSection user={user} />;
            case 'settings': return <SettingsSection user={user} />;
            default: return <div className="p-10 text-center text-gray-400">Section Under Development</div>;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            <aside className="w-64 bg-white border-r p-6 space-y-2 shadow-sm">
                <div className="mb-10 px-2">
                    <h2 className="text-2xl font-black text-blue-600 flex items-center gap-2 tracking-tighter">
                        <ShoppingCart fill="currentColor" size={24}/> AGRI-HUB
                    </h2>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
                    <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={<List size={20}/>} label="Marketplace" active={activeTab === 'browse'} onClick={() => setActiveTab('browse')} />
                    <SidebarItem icon={<History size={20}/>} label="Order History" active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} />
                    <SidebarItem icon={<MessageSquare size={20}/>} label="Reviews & Feedback" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                </div>
                <div className="pt-8 space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Settings</p>
                    <SidebarItem icon={<UserIcon size={20}/>} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SidebarItem icon={<SettingsIcon size={20}/>} label="App Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition mt-10">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md h-20 border-b flex items-center justify-between px-10 z-10">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-gray-800">Welcome Back, {user.username || 'Retailer'}</h1>
                        <p className="text-xs text-gray-400 font-bold">{new Date().toDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div onClick={() => navigate('/checkout')} className="relative cursor-pointer bg-blue-50 p-3 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm">
                            <ShoppingCart size={22}/>
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                    </div>
                </header>
                <div className="p-10 overflow-y-auto flex-1">{renderContent()}</div>
            </main>

            <FeedbackModal
                isOpen={!!ratingData.orderId}
                onClose={() => setRatingData({ orderId: null, productId: null, rating: 5, comment: '' })}
                onSubmit={handleRateSubmit}
                orderId={ratingData.orderId}
            />
        </div>
    );
};

/* --- Sub-Components --- */

const StatCard = ({ icon, title, value, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition">{icon}</div>
        <div>
            <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-black text-gray-800">{value}</p>
            {trend && <p className="text-[10px] font-bold text-green-500 mt-1">{trend}</p>}
        </div>
    </div>
);

const RecentOrdersTable = ({ orders, setRatingData }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                <tr>
                    <th className="pb-4">Items</th>
                    <th className="pb-4 text-center">Amount</th>
                    <th className="pb-4 text-right">Live Tracking</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                    <tr key={order.id} className="group transition hover:bg-gray-50/50">
                        <td className="py-4">
                            <div className="flex flex-col gap-0.5">
                                {order.orderItems?.map((item, i) => (
                                    <span key={i} className="font-bold text-gray-700 block text-xs">{item.product?.name} x{item.quantity}</span>
                                ))}
                                <span className="text-[9px] text-gray-300 font-medium">#{order.id}</span>
                            </div>
                        </td>
                        <td className="py-4 font-black text-gray-900 text-center text-xs">₹{order.totalAmount}</td>
                        <td className="py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                               {order.status === 'COMPLETED' && (
                                   <button
                                       onClick={() => setRatingData({
                                           orderId: order.id,
                                           productId: order.orderItems[0]?.product?.id,
                                           rating: 5,
                                           comment: ''
                                       })}
                                       className={`px-3 py-1 rounded-lg text-[9px] font-black transition-transform active:scale-95 ${
                                           order.hasRated
                                           ? 'bg-gray-100 text-gray-600 border border-gray-200'
                                           : 'bg-yellow-400 text-white shadow-sm'
                                       }`}
                                   >
                                       {order.hasRated ? 'EDIT REVIEW' : 'RATE EXPERIENCE'}
                                   </button>
                               )}
                                {order.hasRated && <span className="text-[9px] text-green-500 font-bold flex items-center gap-1"><CheckCircle size={10} /> Rated</span>}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const QuickInventoryPreview = ({ products, onBrowse }) => (
    <div className="space-y-4">
        {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                        {product.imagePath && <img src={`http://localhost:8080${product.imagePath}`} alt="" className="object-cover w-full h-full" />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase">{product.category}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">₹{product.price}</p>
                    <p className={`text-[9px] font-black uppercase ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>{product.stock} in stock</p>
                </div>
            </div>
        ))}
        <button onClick={onBrowse} className="w-full py-3 bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">View Full Catalog</button>
    </div>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-bold text-sm ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
    }`}>
        {icon} {label}
    </button>
);

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const renderStars = (rating) => [...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
    ));

    return (
        <div className="bg-white border border-gray-100 rounded-[32px] p-5 hover:shadow-2xl hover:shadow-blue-100 transition duration-500 group relative">
            <div className="h-48 bg-gray-50 rounded-[24px] mb-5 overflow-hidden relative shadow-inner">
                {product.imagePath ? <img src={`http://localhost:8080${product.imagePath}`} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" alt={product.name} /> : <div className="h-full w-full flex items-center justify-center text-gray-300 font-black">NO IMAGE</div>}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-blue-50">{product.category}</div>
            </div>
            <h3 className="font-black text-gray-800 text-lg mb-1">{product.name}</h3>
            <div className="flex items-center gap-1 mb-3">
                <div className="flex">{renderStars(product.averageRating || 0)}</div>
                <span className="text-[10px] font-bold text-gray-400">({product.totalReviews || 0} reviews)</span>
            </div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Price per {product.unit}</p>
                    <span className="text-2xl font-black text-blue-600">₹{product.price}</span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}</span>
            </div>
            <button onClick={() => navigate(`/product/${product.id}`, { state: { product } })} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition duration-300 shadow-xl shadow-gray-100">BUY NOW</button>
        </div>
    );
};

export default RetailerDashboard;