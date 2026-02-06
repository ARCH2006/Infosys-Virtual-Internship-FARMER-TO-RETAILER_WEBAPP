import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, ShoppingBag, ClipboardList,
    Bell, Settings, LogOut, ShieldAlert, Activity,
    CreditCard, BarChart3, MessageSquare, Info
} from 'lucide-react';
import { apiService } from '../../services/api.service';
import DashboardOverview from '../admin/DashboardOverview';
import UserManagement from '../admin/UserManagement';
import ProductManagement from '../admin/ProductManagement.jsx';
import OrderManagement from '../admin/OrderManagement.jsx';
import NotificationCenter from '../admin/NotificationCenter.jsx';
import AdminSettings from '../admin/AdminSettings.jsx';

const AdminDashboard = ({ onLogout }) => {
    const [view, setView] = useState('dashboard');
    const [stats, setStats] = useState({ totalFarmers: 0, totalRetailers: 0, totalProducts: 0, totalOrders: 0, transactions: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await apiService.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Stats error", error);
        }
    };

    const renderView = () => {
        switch(view) {
            case 'users': return <UserManagement />;
            case 'products': return <ProductManagement />;
            case 'orders': return <OrderManagement />;
            case 'notifications': return <NotificationCenter />;
            case 'settings': return <AdminSettings />;
            case 'dashboard':
            default: return <DashboardOverview stats={stats} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F9FC] text-slate-700">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r flex flex-col shadow-sm">
                <div className="p-8">
                    <div className="flex items-center gap-3 text-purple-700">
                        <div className="bg-purple-700 p-2 rounded-lg">
                            <ShieldAlert className="text-white" size={24}/>
                        </div>
                        <h1 className="font-bold text-2xl tracking-tight">AdminPanel</h1>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-4">Menu</p>
                    <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                    <SidebarItem icon={<Users size={18}/>} label="Manage Users" active={view === 'users'} onClick={() => setView('users')} />

                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-6 mb-2 px-4">System</p>
                    <SidebarItem icon={<ShoppingBag size={18}/>} label="Products" active={view === 'products'} onClick={() => setView('products')} />
                    <SidebarItem icon={<ClipboardList size={18}/>} label="Orders" active={view === 'orders'} onClick={() => setView('orders')} />
                    <SidebarItem icon={<CreditCard size={18}/>} label="Payments" />

                    {/* KYC Approvals Sidebar Item REMOVED */}

                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-6 mb-2 px-4">Reports</p>
                    <SidebarItem icon={<BarChart3 size={18}/>} label="Analytics" />
                    <SidebarItem icon={<MessageSquare size={18}/>} label="Complaints" />
                    <SidebarItem icon={<Bell size={18}/>} label="Notifications" active={view === 'notifications'} onClick={() => setView('notifications')} />
                    <SidebarItem icon={<Settings size={18}/>} label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
                </nav>

                <div className="p-6 border-t">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all">
                        <LogOut size={18}/> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b h-20 flex justify-between items-center px-10 shadow-sm z-10">
                    <div className="flex gap-4">
                        <StatusBadge icon={<Activity size={14}/>} label="System Online" color="text-emerald-600 bg-emerald-50" />
                        <StatusBadge icon={<Info size={14}/>} label="All Clear" color="text-blue-600 bg-blue-50" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">Admin User</p>
                            <p className="text-[10px] text-slate-400 font-medium">Super Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 bg-[#F8F9FC]">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-slate-500 hover:bg-slate-50 hover:text-purple-700'}`}>
        {icon} <span>{label}</span>
    </button>
);

const StatusBadge = ({ icon, label, color }) => (
    <span className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full ${color}`}>
        {icon} {label}
    </span>
);

export default AdminDashboard;