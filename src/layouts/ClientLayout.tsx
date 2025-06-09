import React, { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold">TrackFlow</span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="hover:underline">Home</a>
                </li>
                <li>
                  <a href="/track" className="hover:underline">Track Courier</a>
                </li>
                <li>
                  <a href="/login" className="hover:underline">Login</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">TrackFlow</h2>
              <p className="mt-2 text-gray-300">Logistics courier management system</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold mb-2">Company</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Services</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">Courier Services</a></li>
                  <li><a href="#" className="hover:text-white">Logistics</a></li>
                  <li><a href="#" className="hover:text-white">Tracking</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Legal</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-300">© 2025 TrackFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
