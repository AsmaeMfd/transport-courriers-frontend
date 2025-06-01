import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { authService } from '../../services/admin/authService'; // Commenté car authService pourrait ne pas être la source du user info
import { UserIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  title?: string;
  userName?: string; // Nom de l'utilisateur pour l'affichage
  userRole?: string; // Rôle de l'utilisateur pour l'affichage
  onLogout: () => void; // Fonction de déconnexion
}

const Navbar: React.FC<NavbarProps> = ({ title, userName = 'Admin', userRole = 'Administrator', onLogout }) => {
  const navigate = useNavigate();
  // const currentUser = authService.getCurrentUser(); // Utiliser les props userName et userRole à la place

  // La logique de déconnexion sera gérée dans le layout parent et passée via onLogout
  // const handleLogout = async () => {
  //   await authService.logout();
  //   navigate('/login');
  // };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left side - Placeholder pour le titre de la section géré par le layout parent */}
       <div className="flex items-center">
            {title && <span className="text-lg font-semibold text-gray-800">{title}</span>}
       </div>

      {/* Right side - User profile and logout */}
      <div className="flex items-center space-x-4">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <span className="text-xs text-gray-500">{userRole}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 