import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
    BuildingOfficeIcon, 
    UserGroupIcon, 
    TruckIcon,
    HomeIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
    { name: 'Agences', href: '/admin/agencies', icon: BuildingOfficeIcon },
    { name: 'Employés', href: '/admin/employees', icon: UserGroupIcon },
    { name: 'Véhicules', href: '/admin/vehicles', icon: TruckIcon },
];

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
                        <h1 className="text-xl font-bold text-white">Administration</h1>
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-6 w-6" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 