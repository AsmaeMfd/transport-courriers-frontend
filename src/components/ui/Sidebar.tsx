import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// Les items seront passés en props pour permettre la réutilisation
interface SidebarProps {
  navItems: NavItem[];
  title?: string;
  className?: string;
  // Ajout de la prop pour afficher le nom et le rôle de l'utilisateur
  userName?: string;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, title = 'TrackFlow', className, userName = 'Admin', userRole = 'Administrator' }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    // Défaut à true si pas en mobile (ou si pas sauvegardé)
    const isMobile = window.innerWidth < 768; // Exemple de breakpoint mobile
    return savedState ? JSON.parse(savedState) : !isMobile; 
  });

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

   // Ajuster l'état isOpen si la fenêtre est redimensionnée au-dessus ou en dessous du breakpoint mobile
   React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // Utiliser la valeur de savedState si elle existe, sinon calculer en fonction de isMobile
      const savedState = localStorage.getItem('sidebarOpen');
      setIsOpen(savedState ? JSON.parse(savedState) : !isMobile);
     };
    // Récupérer l'état sauvegardé une seule fois au montage
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState === null) { // Définir l'état initial si pas de sauvegarde
        const isMobile = window.innerWidth < 768;
        setIsOpen(!isMobile);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Dépendances vides pour s'exécuter une seule fois au montage

  return (
    <div className={twMerge(`relative flex flex-col h-full bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`, className)}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev: boolean) => !prev)}
        className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1.5 shadow-lg hover:bg-gray-100 focus:outline-none z-10 transition-colors duration-200"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="p-6 border-b border-gray-200">
        <h1 className={`text-2xl font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} ${isOpen ? 'block' : 'hidden'}`}>
          {title}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Gérer l'état actif pour les routes imbriquées, en s'assurant que /admin/agencies est actif pour /admin/agencies/new, etc.
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={twMerge(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              {/* Background effect */}
              <div className={twMerge(
                'absolute inset-0 bg-gray-100 opacity-0 transition-opacity duration-200',
                'group-hover:opacity-100',
                 isActive ? 'opacity-100' : ''
              )} />
              
              {/* Content */}
              <div className="relative flex items-center w-full z-10">
                <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className={`ml-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0 block' : 'opacity-0 -translate-x-4 hidden'}`}>
                  {item.label}
                </span>
              </div>

              {/* Active indicator */}
              {isActive && isOpen && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center group">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div className={`ml-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0 block' : 'opacity-0 -translate-x-4 hidden'}`}>
            <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-200">{userName}</p>
            <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 