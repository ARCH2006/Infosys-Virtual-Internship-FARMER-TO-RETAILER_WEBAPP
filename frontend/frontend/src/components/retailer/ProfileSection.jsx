import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Save } from 'lucide-react';
import { apiService } from '../../services/api.service';

const ProfileSection = ({ user }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || ''
    });

    useEffect(() => {
        if (user?.id) {
            // FIX: Ensure we only set the 'data' part of the Axios response
            apiService.getRetailerProfile(user.id)
                .then(response => {
                    // Axios returns data in a .data property
                    // This resolves the "Argument type AxiosResponse is not assignable" warning
                    const profileData = response.data || response;
                    setFormData({
                        username: profileData.username || '',
                        phoneNumber: profileData.phoneNumber || '',
                        email: profileData.email || ''
                    });
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, [user.id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateRetailerProfile({ ...formData, id: user.id });
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <form onSubmit={handleUpdate} className="p-6 bg-white rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <User size={20} className="text-blue-600" />
                <h2 className="font-bold text-gray-800 uppercase tracking-wider text-sm">My Profile</h2>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Username</label>
                <input
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    placeholder="Username"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <Mail size={18} />
                    <span className="text-sm">{formData.email}</span>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-4">
                <Save size={18} /> Save Changes
            </button>
        </form>
    );
};

export default ProfileSection;