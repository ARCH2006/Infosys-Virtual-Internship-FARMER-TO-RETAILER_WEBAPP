import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.service';
import {
    Package, Truck, Key, CheckCircle, RefreshCcw,
    MapPin, Phone, User, ChevronDown, ChevronUp, ShoppingBasket
} from 'lucide-react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Track which order detail is open

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await apiService.get('/admin/orders');
            setOrders(data);
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleAdminUpdate = async (orderId, newStatus) => {
        try {
            await apiService.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
            alert(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
            loadOrders();
        } catch (err) {
            console.error("Status update failed:", err.response?.data);
            alert("Status update failed.");
        }
    };

    const handleConfirmDelivery = async (orderId) => {
        const otp = prompt("Enter the 4-digit Delivery OTP provided by the Retailer:");
        if (!otp) return;
        try {
            await apiService.put(`/admin/orders/${orderId}/verify-delivery?otp=${otp}`);
            alert("OTP Verified! Order marked as DELIVERED.");
            loadOrders();
        } catch (err) {
            alert("Verification failed. Incorrect OTP.");
        }
    };

    const handleFinalSettlement = async (order) => {
        const commission = (order.totalAmount * 0.10).toFixed(2);
        const farmerPay = (order.totalAmount * 0.90).toFixed(2);
        if (window.confirm(`Release Payment?\n\nFarmer Share (90%): ₹${farmerPay}\nAdmin Commission (10%): ₹${commission}\n\nProceed?`)) {
            try {
                await apiService.put(`/admin/orders/${order.id}/settle`);
                alert("Success! Payment disbursed.");
                loadOrders();
            } catch (err) {
                alert("Settlement failed: " + err.message);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-bold text-xl text-slate-800">Global Logistics & Orders</h2>
                <button onClick={loadOrders} className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <tr>
                            <th className="p-6">Order Details</th>
                            <th className="p-6">Transaction</th>
                            <th className="p-6">Current Status</th>
                            <th className="p-6 text-right">Logistics Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                            <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-medium">No orders found.</td></tr>
                        ) : (
                            orders.map(o => (
                                <React.Fragment key={o.id}>
                                    {/* Main Row */}
                                    <tr
                                        onClick={() => toggleOrderDetails(o.id)}
                                        className={`cursor-pointer hover:bg-slate-50 transition ${expandedOrderId === o.id ? 'bg-slate-50' : ''}`}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800">#{o.id}</p>
                                                {expandedOrderId === o.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                            </div>
                                            <p className="text-xs text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-emerald-600">₹{o.totalAmount}</p>
                                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Paid via Wallet</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                o.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {o.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                {o.status === 'READY_FOR_PICKUP' && (
                                                    <button onClick={() => handleAdminUpdate(o.id, 'IN_TRANSIT')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-100">
                                                        <Package size={14}/> PICKUP
                                                    </button>
                                                )}
                                                {o.status === 'IN_TRANSIT' && (
                                                    <button onClick={() => handleAdminUpdate(o.id, 'OUT_FOR_DELIVERY')} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-purple-100">
                                                        <Truck size={14}/> START DELIVERY
                                                    </button>
                                                )}
                                                {o.status === 'OUT_FOR_DELIVERY' && (
                                                    <button onClick={() => handleConfirmDelivery(o.id)} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-orange-100">
                                                        <Key size={14}/> VERIFY OTP
                                                    </button>
                                                )}
                                                {o.status === 'DELIVERED' && (
                                                    <button onClick={() => handleFinalSettlement(o)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-100">
                                                        <CheckCircle size={14}/> RELEASE PAYMENT
                                                    </button>
                                                )}
                                                {o.status === 'COMPLETED' && <span className="text-xs text-slate-400 font-bold italic py-2">Transaction Closed</span>}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {expandedOrderId === o.id && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan="4" className="p-8 border-t border-slate-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                                    {/* Farmer Pickup Details */}
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                                            <MapPin className="text-red-500" size={18}/>
                                                            <h3 className="font-bold text-slate-800">Pickup Location (Farmer)</h3>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><User size={14} className="text-slate-500"/></div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Farmer Name</p>
                                                                    <p className="text-sm font-bold text-slate-700">{o.farmer?.username}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><Phone size={14} className="text-slate-500"/></div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Contact</p>
                                                                    <p className="text-sm font-bold text-slate-700">{o.farmer?.phoneNumber}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><MapPin size={14} className="text-slate-500"/></div>
                                                                     <div>
                                                                         <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Address</p>
                                                                         <p className="text-sm font-bold text-slate-700">
                                                                             {o.pickupAddress || "Not provided yet"}
                                                                         </p>
                                                                     </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Retailer Delivery Details */}
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                                            <Truck className="text-blue-500" size={18}/>
                                                            <h3 className="font-bold text-slate-800">Delivery Address (Retailer)</h3>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><User size={14} className="text-slate-500"/></div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Retailer Name</p>
                                                                    <p className="text-sm font-bold text-slate-700">{o.retailer?.username}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><Phone size={14} className="text-slate-500"/></div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery Phone</p>
                                                                    <p className="text-sm font-bold text-slate-700">{o.contactNumber || o.retailer?.phoneNumber}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-slate-100 p-2 rounded-full"><MapPin size={14} className="text-slate-500"/></div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Shipping Address</p>
                                                                    <p className="text-sm font-bold text-slate-700">{o.shippingAddress}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Order Items Summary */}
                                                    <div className="col-span-full bg-slate-800 p-6 rounded-2xl text-white">
                                                        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                                                            <ShoppingBasket size={18}/>
                                                            <h3 className="font-bold">Ordered Items</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {o.orderItems?.map(item => (
                                                                <div key={item.id} className="bg-slate-700 p-3 rounded-xl">
                                                                    <p className="text-xs font-bold text-slate-300">{item.product?.name}</p>
                                                                    <p className="text-lg font-black text-emerald-400">x{item.quantity}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;