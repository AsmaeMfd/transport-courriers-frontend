import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                            },
                        }}
                    />
                    <AuthRoutes />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App; 