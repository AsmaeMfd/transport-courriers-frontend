import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Sidebar from '../components/ui/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { 
    HomeIcon, 
    DocumentTextIcon, 
    ClipboardDocumentListIcon,
    TruckIcon
} from '@heroicons/react/24/outline';

const OperatorLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const location = useLocation();

    const getSectionTitle = (pathname: string) => {
        if (pathname.startsWith('/operator/courriers')) return 'Courriers';
        if (pathname.startsWith('/operator/livraisons')) return 'Livraisons';
        if (pathname.startsWith('/operator/factures')) return 'Factures';
        return 'Section Opérateur';
    };

    const sectionTitle = getSectionTitle(location.pathname);

    const sidebarNavItems = [
        {
            label: 'Courriers',
            icon: <DocumentTextIcon className="h-6 w-6" />,
            path: '/operator/courriers',
        },
        {
            label: 'Livraisons',
            icon: <TruckIcon className="h-6 w-6" />,
            path: '/operator/livraisons',
        },
        {
            label: 'Factures',
            icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
            path: '/operator/factures',
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                navItems={sidebarNavItems}
                title="Section Opérateur"
                userName={user?.employe?.nom_emp || user?.email || 'Opérateur'}
                userRole={user?.role?.nom || 'Opérateur'}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar
                    title={sectionTitle}
                    userName={user?.employe?.nom_emp || user?.email || 'Opérateur'}
                    userRole={user?.role?.nom || 'Opérateur'}
                    onLogout={handleLogout}
                />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OperatorLayout;
