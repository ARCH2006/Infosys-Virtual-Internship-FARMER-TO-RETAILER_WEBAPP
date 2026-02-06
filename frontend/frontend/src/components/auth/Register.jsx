import React, { useState } from 'react';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'FARMER'
    });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });

        try {
            await authService.register(formData);
            setMsg({ text: "Registration Successful! Redirecting...", type: "success" });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setMsg({ text: "Registration failed. Email may already be in use.", type: "error" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join the farmer-retailer network</p>
                </div>

                {msg.text && (
                    <p className={`text-center text-sm p-2 rounded ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {msg.text}
                    </p>
                )}

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-green-500"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        autoComplete="username"
                        required
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-green-500"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <input
                        type="password"
                        placeholder="Create Password"
                        autoComplete="new-password"
                        required
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-green-500"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    <input
                        type="tel"
                        placeholder="Phone Number (e.g. 9876543210)"
                        required
                        className="w-full p-2.5 border rounded-lg outline-none focus:border-green-500"
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 px-1">SELECT ROLE</label>
                        <select
                            className="w-full p-2.5 border rounded-lg outline-none bg-gray-50 font-medium"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="FARMER">Farmer</option>
                            <option value="RETAILER">Retailer</option>
                        </select>
                    </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md active:scale-95">
                    Create Account
                </button>

                <div className="text-center text-sm mt-4">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link to="/login" className="text-green-600 hover:underline font-bold">
                        Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;