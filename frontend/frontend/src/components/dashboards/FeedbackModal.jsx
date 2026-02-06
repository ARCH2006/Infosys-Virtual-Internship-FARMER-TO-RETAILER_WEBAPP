import React, { useState } from 'react';
import { Star } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit, orderId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-black text-gray-800 mb-2">Rate Your Experience</h2>
                <p className="text-sm text-gray-500 mb-6">Order #{orderId}</p>

                <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={32}
                            className={`cursor-pointer transition-all ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                <textarea
                    className="w-full border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-6"
                    placeholder="Tell the farmer how they did..."
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl">Cancel</button>
                    <button
                        onClick={() => onSubmit({ rating, comment })}
                        disabled={rating === 0}
                        className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;