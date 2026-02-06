import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { apiService } from '../../services/api.service';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ username: '', role: '' });

    useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
          try {
              const response = await apiService.get('/admin/users');

              const userData = Array.isArray(response) ? response : (response.data || []);
              setUsers(userData);

          } catch (error) {
              console.error("Failed to load users", error);
              setUsers([]); // Reset to empty array on error to prevent crash
          }
      };
    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditData({ username: user.username, role: user.role });
    };

    const handleSave = async (id) => {
        try {
            await apiService.put(`/admin/users/${id}`, editData);
            setEditingId(null);
            loadUsers();
        } catch (error) { alert("Update failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            try {
                await apiService.delete(`/admin/users/${id}`);
                loadUsers();
            } catch (error) { alert("Delete failed"); }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-bold text-gray-800 text-lg">Platform Users</h2>
                <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">{users.length} Total</span>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                <tr>
                    <th className="p-4 border-b">Name</th>
                    <th className="p-4 border-b">Email</th>
                    <th className="p-4 border-b">Role</th>
                    <th className="p-4 border-b text-center">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {(users || []).map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                            {editingId === user.id ? (
                                <input
                                    className="border rounded px-2 py-1 w-full outline-purple-500"
                                    value={editData.username}
                                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                                />
                            ) : user.username || user.user?.username || "No Name"}
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4">
                            {editingId === user.id ? (
                                <select
                                    className="border rounded px-2 py-1"
                                    value={editData.role}
                                    onChange={(e) => setEditData({...editData, role: e.target.value})}
                                >
                                    <option value="FARMER">FARMER</option>
                                    <option value="RETAILER">RETAILER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            ) : (
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>{user.role}</span>
                            )}
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                            {editingId === user.id ? (
                                <>
                                    <button onClick={() => handleSave(user.id)} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check size={18}/></button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400 p-1 hover:bg-gray-50 rounded"><X size={18}/></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(user)} className="text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;