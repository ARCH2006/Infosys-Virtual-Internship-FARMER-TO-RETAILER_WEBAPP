import React from 'react';
import { Settings, Save } from 'lucide-react';

const AdminSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="text-gray-600" /> Admin Configurations
        </h2>
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Platform Commission (%)</label>
                <input type="number" defaultValue="5" className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Admin Contact Email</label>
                <input type="email" defaultValue="admin@farmerplatform.com" className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <button type="button" className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <Save size={18} /> Save Settings
            </button>
        </form>
    </div>
);

export default AdminSettings;