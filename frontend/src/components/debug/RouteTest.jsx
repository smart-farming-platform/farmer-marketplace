import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RouteTest = () => {
    const location = useLocation()
    const { isAuthenticated, user, isLoading } = useAuth()

    const testRoutes = [
        { path: '/', name: 'Home' },
        { path: '/products', name: 'Products' },
        { path: '/farmers', name: 'Farmers' },
        { path: '/market', name: 'Market Intelligence' },
        { path: '/weather', name: 'Smart Weather' },
        { path: '/login', name: 'Login' },
        { path: '/register', name: 'Register' },
        { path: '/dashboard', name: 'Dashboard', protected: true },
        { path: '/dashboard/profile', name: 'Profile', protected: true }
    ]

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs z-50">
            <h3 className="font-semibold text-gray-900 mb-2">Route Test</h3>
            <p className="text-xs text-gray-600 mb-3">Current: {location.pathname}</p>

            <div className="space-y-1">
                {testRoutes.map(route => (
                    <Link
                        key={route.path}
                        to={route.path}
                        className={`block px-2 py-1 text-xs rounded transition-colors ${location.pathname === route.path
                                ? 'bg-green-100 text-green-800'
                                : route.protected && !isAuthenticated
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        title={route.protected && !isAuthenticated ? 'Login required' : ''}
                    >
                        {route.name} {route.protected && '🔒'}
                    </Link>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                <div className="space-y-1">
                    <div className={`${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                        Auth: {isLoading ? 'Loading...' : isAuthenticated ? 'Logged in' : 'Not logged in'}
                    </div>
                    {user && (
                        <div className="text-gray-600">
                            User: {user.name} ({user.role})
                        </div>
                    )}
                    <div className="text-gray-500">
                        Current: {location.pathname}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RouteTest