import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Backend now returns redirectPath directly (/farmer/dashboard, etc.)
            const user = await authService.login(formData.email, formData.password);

            onLogin(user);

            // Redirect to the dashboard immediately
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Agri-Hub Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        autoComplete="username"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        autoComplete="current-password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-gray-600 text-sm">Don't have an account? </span>
                    <Link to="/register" className="text-green-600 hover:underline font-bold">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;