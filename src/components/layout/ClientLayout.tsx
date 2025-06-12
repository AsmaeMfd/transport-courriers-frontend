import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    HomeIcon, 
    UserIcon, 
    TruckIcon, 
    PlusCircleIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const ClientLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const navigation = [
        { name: 'Tableau de bord', href: '/client', icon: HomeIcon },
        { name: 'Mon profil', href: '/client/profile', icon: UserIcon },
        { name: 'Mes envois', href: '/client/shipments', icon: TruckIcon },
        { name: 'Nouvel envoi', href: '/client/new-shipment', icon: PlusCircleIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    {/* Logo et titre */}
                    <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
                        <h1 className="text-xl font-bold text-white">E-Ship</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Profil et déconnexion */}
                    <div className="p-4 border-t">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <UserIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                                <p className="text-xs text-gray-500">Client</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClientLayout; 