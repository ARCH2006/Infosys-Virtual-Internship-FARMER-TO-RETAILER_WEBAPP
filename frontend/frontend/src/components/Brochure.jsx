import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingBag, ArrowRight, TrendingUp, ShieldCheck, ShoppingCart } from 'lucide-react';

const Brochure = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-green-100">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="p-2 bg-green-600 rounded-xl shadow-md">
                            <Sprout className="text-white w-7 h-7" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                            <ShoppingBag className="text-white w-3 h-3" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tight text-gray-900 leading-none">
                            Farm<span className="text-green-600">Direct</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Direct Trading Hub
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="hidden md:block text-gray-600 hover:text-green-600 font-semibold transition">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                        Join Now
                    </Link>
                </div>
            </nav>

            {/* Hero Section with Professional Background Image */}
            <header className="relative min-h-[80vh] flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Green farmland"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
                    <div className="max-w-2xl text-left">
                        <div className="inline-block px-4 py-1.5 mb-6 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-green-400 font-bold text-sm tracking-wide uppercase">
                            Direct from Source
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
                            Revolutionizing the <br />
                            <span className="text-green-500">Farm-to-Fork</span> Journey
                        </h1>
                        <p className="text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
                            A secure, transparent trading platform empowering farmers with better prices and retailers with fresher produce.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95">
                                Start Trading Now <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black text-gray-900 mb-4 italic">Why Choose Our Platform?</h2>
                    <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <FeatureCard
                        icon={<TrendingUp className="text-green-600" size={40} />}
                        title="Better Profits"
                        desc="By removing middlemen, farmers earn more and retailers pay less. Everyone wins."
                        color="green"
                    />
                    <FeatureCard
                        icon={<ShoppingCart className="text-blue-600" size={40} />}
                        title="Real-time Inventory"
                        desc="Browse live stock levels from local farms. Get what you need, when it's fresh."
                        color="blue"
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-emerald-600" size={40} />}
                        title="Secure Payments"
                        desc="Fully transparent transaction tracking with secure digital payment processing."
                        color="emerald"
                    />
                </div>
            </section>

            {/* Stats/Trust Section */}
            <section className="bg-gray-900 py-20 text-white px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <StatItem value="500+" label="Verified Farmers" />
                    <StatItem value="1.2k" label="Active Retailers" />
                    <StatItem value="15t+" label="Produce Sold" />
                    <StatItem value="24/7" label="Global Support" />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-8 bg-green-50">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 text-center shadow-xl border border-green-100">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to transform your business?</h2>
                    <p className="text-lg text-gray-600 mb-8">Join thousands of farmers and retailers growing together.</p>
                    <Link to="/register" className="inline-block px-10 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition shadow-lg">
                        Create Your Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t px-8 text-center text-gray-500 bg-white">
                <p className="font-medium">&copy; 2026 AgriTrade Platform. Building a sustainable future for agriculture.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="p-10 border border-gray-100 rounded-[2rem] bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left">
        <div className={`mb-6 inline-block p-4 rounded-2xl bg-${color}-50`}>{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg">{desc}</p>
    </div>
);

const StatItem = ({ value, label }) => (
    <div className="group">
        <p className="text-5xl font-black text-green-400 group-hover:scale-110 transition-transform duration-300">{value}</p>
        <p className="text-gray-400 uppercase text-xs tracking-[0.2em] font-bold mt-4">{label}</p>
    </div>
);

export default Brochure;