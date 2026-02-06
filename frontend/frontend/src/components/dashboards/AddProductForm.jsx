import React, { useState } from 'react';
import { apiService } from '../../services/api.service';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const AddProductForm = ({ user, onSuccess }) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        unit: 'KG'
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Optional: Add a size check here (e.g., < 5MB)
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData();
      // These keys MUST match the @RequestParam names in your Java Controller
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', parseFloat(product.price));
      formData.append('stock', parseInt(product.stock));
      formData.append('category', product.category);
      formData.append('unit', product.unit);
      formData.append('farmerId', user?.id);

      if (imageFile) {
          formData.append('image', imageFile); // 'image' matches @RequestParam("image")
      }

      try {
          // IMPORTANT: Call the service without passing manual headers
          const response = await apiService.post('/products/add', formData);
          alert("Product Added Successfully!");

          // Reset state on success
          setProduct({ name: '', description: '', price: '', stock: '', category: '', unit: 'KG' });
          setImageFile(null);
          setPreviewUrl(null);
          if (onSuccess) onSuccess(response);
      } catch (err) {
          console.error("Upload error:", err);
          // Extract string message to avoid "Objects are not valid as React child" error
          const msg = err.response?.data?.error || err.response?.data || "Check console for 415 error details";
          setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      } finally {
          setLoading(false);
      }
  };
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-green-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">List New Produce</h2>
            </div>

          {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {typeof error === 'object' ? error.error || 'Unknown Error' : error}
              </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    {previewUrl ? (
                        <div className="relative w-full h-48">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                            <button
                                type="button"
                                onClick={() => {setImageFile(null); setPreviewUrl(null);}}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center cursor-pointer py-6 w-full">
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <span className="text-gray-500 font-medium">Click to upload product image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <div className="space-y-4">
                    <input
                        type="text" placeholder="Product Name"
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required
                        value={product.name}
                        onChange={(e) => setProduct({...product, name: e.target.value})}
                    />
                    <textarea
                        placeholder="Product Description"
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 h-24"
                        value={product.description}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number" placeholder="Price"
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required
                            value={product.price}
                            onChange={(e) => setProduct({...product, price: e.target.value})}
                        />
                        <select
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            value={product.category}
                            onChange={(e) => setProduct({...product, category: e.target.value})}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Grains">Grains</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number" placeholder="Initial Stock"
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required
                            value={product.stock}
                            onChange={(e) => setProduct({...product, stock: e.target.value})}
                        />
                        <input
                            type="text" placeholder="Unit (e.g., KG)"
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                            value={product.unit}
                            onChange={(e) => setProduct({...product, unit: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-bold text-white transition-all flex justify-center items-center gap-2 ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'
                    }`}
                >
                    {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {loading ? 'Uploading...' : 'Submit Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;