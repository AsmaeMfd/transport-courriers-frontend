import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import { useNavigate, Link } from 'react-router-dom';

// Interface pour la dernière tentative de connexion
interface LastLoginAttempt {
    email: string;
    timestamp: number;
}

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [lastAttempt, setLastAttempt] = useState<LastLoginAttempt | null>(null);
    const { login, isAuthenticated, user, handleAuthError, handleRedirect } = useAuth();
    const navigate = useNavigate();

    // Validation du formulaire
    const validateForm = useCallback((email: string, password: string): string | null => {
        if (!email) return 'L\'email est requis';
        if (!email.includes('@')) return 'Format d\'email invalide';
        if (!password) return 'Le mot de passe est requis';
        if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
        return null;
    }, []);

    // Redirection si déjà authentifié
    useEffect(() => {
        if (isAuthenticated && user && user.role) {
            const role = user.role.nom;
            switch (role) {
                case 'ADMIN':
                    navigate('/admin');
                    break;
                case 'OPERATEUR':
                    navigate('/operator');
                    break;
                default:
                    navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    // Vérification de la dernière tentative de connexion
    useEffect(() => {
        const savedAttempt = localStorage.getItem('lastLoginAttempt');
        if (savedAttempt) {
            try {
                const attempt = JSON.parse(savedAttempt);
                const now = Date.now();
                // Si la dernière tentative date de moins de 5 minutes
                if (now - attempt.timestamp < 5 * 60 * 1000) {
                    setLastAttempt(attempt);
                } else {
                    localStorage.removeItem('lastLoginAttempt');
                }
            } catch (error) {
                console.error('Erreur lors de la lecture de la dernière tentative:', error);
                localStorage.removeItem('lastLoginAttempt');
            }
        }
    }, []);

    const handleLogin = useCallback(async (email: string, password: string) => {
        // Protection contre les soumissions multiples
        if (isSubmitting) return;

        setIsSubmitting(true);
        setIsLoading(true);
        setFormError(null);

        try {
            // Validation du formulaire
            const validationError = validateForm(email, password);
            if (validationError) {
                throw new Error(validationError);
            }

            // Sauvegarde de la tentative
            const attempt = { email, timestamp: Date.now() };
            setLastAttempt(attempt);
            localStorage.setItem('lastLoginAttempt', JSON.stringify(attempt));

            // Appel à l'API d'authentification
            await login(email, password);
            
            // Attendre que les données de l'utilisateur soient disponibles
            const checkUserAndRedirect = () => {
                if (user?.role?.nom) {
                    handleRedirect(user.role.nom);
                } else {
                    // Réessayer après un court délai si les données ne sont pas encore disponibles
                    setTimeout(checkUserAndRedirect, 100);
                }
            };
            
            checkUserAndRedirect();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
            setFormError(errorMessage);
            handleAuthError(err);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    }, [isSubmitting, validateForm, login, handleAuthError, user, handleRedirect]);

    // Si l'utilisateur est déjà authentifié, ne pas afficher la page de login
    if (isAuthenticated) {
        return null;
    }

    // Mémorisation des sections d'information
    const infoSections = useMemo(() => [
        {
            title: 'Gestion des Agences',
            description: 'Gérez vos agences et leurs activités',
            icon: (
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            )
        },
        {
            title: 'Suivi des Courriers',
            description: 'Suivez vos envois en temps réel',
            icon: (
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            )
        },
        {
            title: 'Gestion des Employés',
            description: 'Gérez votre personnel efficacement',
            icon: (
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            )
        }
    ], []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
            {/* En-tête */}
            <header className="bg-white shadow-sm" role="banner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Système de Gestion de Transport
                            </h1>
                        </div>
                        <div>
                            <Link
                                to="/client"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Accéder à l'interface client
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main role="main">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Section de bienvenue */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Bienvenue sur notre plateforme
                        </h2>
                        <p className="mt-3 text-lg text-gray-500">
                            Connectez-vous pour accéder à votre espace de gestion
                        </p>
                    </div>

                    {/* Message d'erreur */}
                    {formError && (
                        <div className="max-w-md mx-auto mb-4" role="alert">
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{formError}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulaire de connexion */}
                    <div className="mt-8 max-w-md mx-auto">
                        <LoginForm
                            onSubmit={handleLogin}
                            isLoading={isLoading}
                            error={formError}
                            lastAttempt={lastAttempt}
                        />
                    </div>

                    {/* Section d'informations */}
                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {infoSections.map((section, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                                        {section.icon}
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        {section.title}
                                    </h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        {section.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Pied de page */}
            <footer role="contentinfo">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Système de Gestion de Transport. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;