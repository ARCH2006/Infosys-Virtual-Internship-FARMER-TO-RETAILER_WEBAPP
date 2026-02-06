import React from 'react';
import { Activity, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

const DashboardOverview = ({ stats }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
                <p className="text-slate-500 text-sm">Real-time performance metrics and recent activities.</p>
            </div>

            {/* System Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Farmers" value={stats.totalFarmers} icon={<Users className="text-orange-600"/>} bgColor="bg-orange-50" border="border-orange-200" />
                <StatCard title="Total Retailers" value={stats.totalRetailers} icon={<ShoppingCart className="text-blue-600"/>} bgColor="bg-blue-50" border="border-blue-200" />
                <StatCard title="Products Listed" value={stats.totalProducts} icon={<Package className="text-emerald-600"/>} bgColor="bg-emerald-50" border="border-emerald-200" />
                <StatCard title="Transactions" value={`₹${stats.transactions || '0'}`} icon={<TrendingUp className="text-purple-600"/>} bgColor="bg-purple-50" border="border-purple-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Activity Logs - Column 1 & 2 */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-slate-400"/> Recent Activity Logs
                    </h3>
                    <div className="space-y-6">
                        <ActivityItem label="New Farmer Registered" detail="Ram Singh joined the platform" time="2 mins ago" />
                        <ActivityItem label="Order Placed" detail="Retailer #402 ordered 50kg Wheat" time="15 mins ago" />
                        <ActivityItem label="Product Approved" detail="Fresh Tomatoes listed by Farmer #12" time="1 hour ago" />
                        <ActivityItem label="Payment Successful" detail="Payout of ₹4,500 to Farmer #08" time="4 hours ago" />
                    </div>
                </div>

                {/* System Health / Status - Column 3 */}
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="font-bold text-lg mb-6">Product Approvals</h3>
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="text-slate-300" size={30}/>
                        </div>
                        <p className="text-sm font-medium text-slate-500">No products pending review</p>
                    </div>
                    <hr className="my-6 border-slate-100" />
                    <h3 className="font-bold text-lg mb-4">System Health</h3>
                    <div className="space-y-4">
                        <HealthBar label="Database" percentage="98%" />
                        <HealthBar label="API Response" percentage="100%" />
                        <HealthBar label="Storage" percentage="45%" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, bgColor, border }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${border} transition-transform hover:-translate-y-1`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-800">{value}</p>
            </div>
            <div className={`${bgColor} p-3 rounded-xl`}>{icon}</div>
        </div>
    </div>
);

const ActivityItem = ({ label, detail, time }) => (
    <div className="flex gap-4">
        <div className="relative">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="absolute top-4 bottom-[-24px] left-[3px] w-[1px] bg-slate-100 last:hidden"></div>
        </div>
        <div className="flex-1 pb-4">
            <p className="text-sm font-bold text-slate-800">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{detail}</p>
            <p className="text-[10px] text-slate-400 mt-1">{time}</p>
        </div>
    </div>
);

const HealthBar = ({ label, percentage }) => (
    <div>
        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-tight">
            <span>{label}</span>
            <span>{percentage}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full" style={{ width: percentage }}></div>
        </div>
    </div>
);

export default DashboardOverview;