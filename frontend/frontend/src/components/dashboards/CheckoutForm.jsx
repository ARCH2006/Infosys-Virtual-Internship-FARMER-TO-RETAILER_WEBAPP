/* global Razorpay */
import React, { useState } from 'react';
import { Trash2, MapPin, Phone, CreditCard, ShieldCheck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';

const CheckoutForm = ({ cartItems, setCart, user, total }) => {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckoutProcess = async (e) => {
        if (e) e.preventDefault();

        if (!address || !phone) {
            alert("Please provide delivery address and contact number.");
            return;
        }

        setLoading(true);

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            const options = {
                key: "rzp_test_S5jKoZy6JHTcbO", // Your Test Key
                amount: Math.round(total * 100), // Amount in paise
                currency: "INR",
                name: "Agri-Hub Marketplace",
                description: "Direct Farmer-Retailer Trade",
                theme: { color: "#10b981" },
                prefill: {
                    name: user?.username || "",
                    contact: phone
                },
                // THE HANDLER: Runs only after payment success
                handler: async function (paymentResponse) {
                    try {
                        const orderData = {
                            retailer: { id: user.id },
                            totalAmount: total,
                            shippingAddress: address,
                            contactNumber: phone,
                            status: "PENDING",
                            paymentId: paymentResponse.razorpay_payment_id,
                            orderItems: cartItems.map(item => ({
                                product: { id: item.id },
                                quantity: item.quantity
                            }))
                        };

                        // PLACING THE ORDER IN BACKEND
                        await apiService.placeOrder(orderData);

                        alert("Payment Successful! Order has been placed.");
                        if (setCart) setCart([]); // Clear cart state
                        navigate('/retailer-dashboard');
                    } catch (err) {
                        console.error("Order save failed:", err);
                        alert("Payment was successful, but we couldn't save your order. Contact support with Payment ID: " + paymentResponse.razorpay_payment_id);
                    }
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Payment Init Error:", err);
            alert("Could not initialize payment.");
            setLoading(false);
        }
    };

    // Helper functions for cart management
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    };

    const removeItem = (id) => {
        setCart(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
                    <p className="mt-2 text-lg text-gray-600">Secure your order by providing delivery details.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Review Items */}
                    <div className="lg:col-span-7 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Review Items ({cartItems.length})</h2>
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border">
                                    <img src={`http://localhost:8080${item.imagePath}`} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-emerald-600 font-bold">₹{item.price}</p>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 hover:bg-white rounded transition">-</button>
                                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 hover:bg-white rounded transition">+</button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition"><Trash2 size={20} /></button>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden sticky top-8">
                            <div className="p-8 bg-gray-900 text-white">
                                <p className="text-gray-400 text-xs uppercase font-black tracking-widest">Total Amount</p>
                                <h3 className="text-3xl font-black text-emerald-400 mt-1">₹{total}</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> Delivery Address</label>
                                        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full street address, city, and pincode" className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 min-h-[100px]" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={16} className="text-emerald-500" /> Contact Number</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500" required />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckoutProcess}
                                    disabled={loading || cartItems.length === 0}
                                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 disabled:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-3"
                                >
                                    {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <><CreditCard size={22} /> Complete Purchase</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;