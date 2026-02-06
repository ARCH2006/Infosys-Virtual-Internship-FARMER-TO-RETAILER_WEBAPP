import React from 'react';
import { Bell } from 'lucide-react';

const NotificationSidebar = ({ isOpen, onClose, notifications }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Dark Overlay/Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 border-l">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Bell size={20} className="text-green-600" /> Notifications
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black p-1">✕</button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-80px)] p-4 space-y-3">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-xl border leading-tight transition-all hover:shadow-sm ${n.isRead ? 'bg-white border-gray-100' : 'bg-green-50 border-green-100'}`}>
                            <p className="font-bold text-sm text-gray-800">{n.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-[9px] text-gray-400 uppercase font-medium">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                                {!n.isRead && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-400 text-sm">
                            <Bell size={40} className="mx-auto mb-2 opacity-20" />
                            <p>No new notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationSidebar;