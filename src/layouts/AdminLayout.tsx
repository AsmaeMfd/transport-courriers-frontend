import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Sidebar from '../components/ui/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, BuildingOffice2Icon, ArchiveBoxIcon, TruckIcon } from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation();

  const getSectionTitle = (pathname: string) => {
    if (pathname.startsWith('/admin/dashboard')) return 'Tableau de Bord';
    if (pathname.startsWith('/admin/agencies')) return 'Agences';
    if (pathname.startsWith('/admin/employees')) return 'Employés';
    if (pathname.startsWith('/admin/vehicles')) return 'Véhicules';
    return 'Section Admin';
  };

  const sectionTitle = getSectionTitle(location.pathname);

  const sidebarNavItems = [
    {
      label: 'Dashboard',
      icon: <HomeIcon className="h-6 w-6" />,
      path: '/admin/dashboard',
    },
    {
      label: 'Agences',
      icon: <BuildingOffice2Icon className="h-6 w-6" />,
      path: '/admin/agencies',
    },
    {
      label: 'Employés',
      icon: <ArchiveBoxIcon className="h-6 w-6" />,
      path: '/admin/employees',
    },
    {
      label: 'Véhicules',
      icon: <TruckIcon className="h-6 w-6" />,
      path: '/admin/vehicles',
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
        title="Section Administrateur"
        userName={user?.employe?.nom_emp || user?.email || 'Admin'}
        userRole={user?.role?.nom || 'Administrateur'}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Section Administrateur"
          userName={user?.employe?.nom_emp || user?.email || 'Admin'}
          userRole={user?.role?.nom || 'Administrateur'}
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

export default AdminLayout;
