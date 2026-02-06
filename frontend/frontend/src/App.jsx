import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/auth.service';

// Components
import Brochure from './components/Brochure';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FarmerDashboard from './components/dashboards/FarmerDashboard';
import RetailerDashboard from './components/dashboards/RetailerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ProductDetail from './components/dashboards/ProductDetail';
import CheckoutForm from './components/dashboards/CheckoutForm';

const getCartKey = (user) => user ? `cart_${user.id || user.username}` : 'guest_cart';

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getCurrentUser());
    const [isLoading, setIsLoading] = useState(true);
    const [lastOrder, setLastOrder] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const savedCart = localStorage.getItem(getCartKey(currentUser));
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem(getCartKey(user), JSON.stringify(cart));
        }
    }, [cart, user]);

    const handleLogin = (userData) => {
        setUser(userData);
        const savedCart = localStorage.getItem(getCartKey(userData));
        setCart(savedCart ? JSON.parse(savedCart) : []);
        // Navigate based on role immediately
        navigate('/dashboard');
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setCart([]);
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleOrderSuccess = (order) => {
        setLastOrder(order);
        setCart([]);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen font-mono">Loading Agri-Hub...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Brochure />} />
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            {/* Simplified Dashboard Route: No KYC checks */}
            <Route
                path="/dashboard"
                element={
                    user ? (
                        <div className="app-container">
                            {user.role === 'RETAILER' && (
                                <RetailerDashboard user={user} onLogout={handleLogout} cart={cart} setCart={setCart} addToCart={addToCart} onOrderSuccess={handleOrderSuccess} />
                            )}
                            {user.role === 'FARMER' && (
                                <FarmerDashboard user={user} onLogout={handleLogout} />
                            )}
                            {user.role === 'ADMIN' && (
                                <AdminDashboard user={user} onLogout={handleLogout} />
                            )}
                        </div>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route
                path="/checkout"
                element={<CheckoutForm
                    cartItems={cart}
                    setCart={setCart}
                    user={user}
                    total={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                    onOrderSuccess={handleOrderSuccess}
                />}
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;