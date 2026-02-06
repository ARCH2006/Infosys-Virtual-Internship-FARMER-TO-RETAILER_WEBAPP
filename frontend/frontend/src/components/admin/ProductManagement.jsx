import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.service';
import { Trash2, ExternalLink } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await apiService.get('/admin/products');
            setProducts(data);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this product listing?")) {
            try {
                await apiService.delete(`/admin/products/${id}`);
                loadProducts();
            } catch (e) {
                // This will now show "Cannot delete: Product is linked to existing orders"
                // instead of just a generic error.
                alert(e.response?.data || "Delete failed");
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b font-bold text-lg text-gray-800">System Product Catalog</div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                <tr>
                    <th className="p-4 border-b">Product</th>
                    <th className="p-4 border-b">Category</th>
                    <th className="p-4 border-b">Price</th>
                    <th className="p-4 border-b">Stock</th>
                    <th className="p-4 border-b text-center">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-purple-700">{p.name}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4">₹{p.price}</td>
                        <td className="p-4">{p.stock} {p.unit}</td>
                        <td className="p-4 flex justify-center gap-3">
                            <button onClick={() => handleDelete(p.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;