import React, { useState } from 'react';
import { Lock, Bell, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api.service';

const SettingsSection = ({ user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            // Calling the API endpoint you defined in api.service.js
            await apiService.changePassword(user.id, newPassword);
            alert("Password updated successfully!");
            setNewPassword('');
        } catch (err) {
            console.error(err);
            alert("Failed to update password. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Security Section */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
                    <Lock size={18} className="text-blue-600"/> Security
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>

            {/* Notifications Section */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800">
                    <Bell size={18} className="text-orange-500"/> Notifications
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Email Alerts</p>
                        <p className="text-xs text-gray-400">Get notified about new orders and tracking updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;