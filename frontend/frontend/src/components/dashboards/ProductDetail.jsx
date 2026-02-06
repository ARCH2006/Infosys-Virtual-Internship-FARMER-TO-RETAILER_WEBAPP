import React, { useState, useEffect } from 'react'; // Added useEffect here
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, MessageSquare, User } from 'lucide-react';
import { apiService } from '../../services/api.service';

const ProductDetail = ({ addToCart }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const product = state?.product;

    const [quantity, setQuantity] = useState(1);
    const [productReviews, setProductReviews] = useState([]);

    // This hook runs automatically when the page opens
    useEffect(() => {
        if (product?.id) {
            loadProductReviews(product.id);
        }
    }, [product?.id]);

    const loadProductReviews = async (productId) => {
        try {
            const reviews = await apiService.get(`/feedback/product/${productId}`);
            setProductReviews(reviews);
        } catch (err) {
            console.error("Failed to load product reviews", err);
        }
    };

    if (!product) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl text-gray-600 mb-4">Product not found</p>
            <button onClick={() => navigate(-1)} className="text-blue-600 font-bold underline">Go Back</button>
        </div>
    );

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: parseInt(quantity) });
        alert(`${quantity} ${product.name}(s) added to cart!`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 bg-white min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-8"
            >
                <ArrowLeft size={20} /> Back to Products
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center border">
                    {product.imagePath ? (
                        <img
                            src={`http://localhost:8080${product.imagePath}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-400 text-lg">No Image Available</div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                            {product.category || 'Fresh Produce'}
                        </span>
                        <h1 className="text-4xl font-black text-gray-800 mt-2">{product.name}</h1>
                        <div className="flex items-center gap-1 mt-2 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.round(product.averageRating || 0) ? "currentColor" : "none"}
                                />
                            ))}
                            <span className="text-gray-400 text-sm ml-2">
                                ({product.averageRating?.toFixed(1) || '0.0'} Rating)
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                        {product.description || "Freshly sourced high-quality produce directly from local farms."}
                    </p>

                    <div className="flex items-baseline gap-4">
                        <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-gray-500">per {product.unit || 'kg'}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 py-4 border-y">
                        <span className="font-bold text-gray-700">Quantity:</span>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            >-</button>
                            <input
                                type="number"
                                value={quantity}
                                readOnly
                                className="w-16 text-center focus:outline-none"
                            />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            >+</button>
                        </div>
                        <span className="text-sm text-gray-400">{product.stock} units available</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg disabled:bg-gray-300"
                    >
                        <ShoppingCart size={22} /> Add to My Cart
                    </button>

                    {/* Customer Reviews Section */}
                    <div className="mt-12 border-t border-gray-100 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                <MessageSquare className="text-blue-600" size={20} />
                                Customer Reviews
                            </h3>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                {productReviews.length} Feedback(s)
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {productReviews.length > 0 ? productReviews.map((rev) => (
                                <div key={rev.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {rev.retailer?.username?.charAt(0).toUpperCase() || 'R'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800">{rev.retailer?.username || "Verified Retailer"}</p>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={10}
                                                            fill={i < rev.rating ? "currentColor" : "none"}
                                                            className={i < rev.rating ? "" : "text-gray-200"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">
                                            {new Date(rev.createdDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50/50 p-3 rounded-2xl">
                                        "{rev.comment}"
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 text-sm font-bold italic">No comments yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;