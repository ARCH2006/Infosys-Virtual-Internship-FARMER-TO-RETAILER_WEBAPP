import React from 'react';
import { Bell, Info } from 'lucide-react';

const NotificationCenter = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="text-purple-600" /> System Notifications
        </h2>
        <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <Info className="text-blue-500" />
                <div>
                    <p className="font-bold">System Update</p>
                    <p className="text-sm text-gray-600">The platform will undergo maintenance at 12:00 AM UTC.</p>
                </div>
            </div>
            <p className="text-center text-gray-400 py-10">No new alerts at this time.</p>
        </div>
    </div>
);

export default NotificationCenter;