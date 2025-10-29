import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const QuickLogin = () => {
    const { login, isAuthenticated, user, logout } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleDemoLogin = async (role) => {
        setIsLoading(true)

        // Create a demo user without backend
        const demoUser = {
            id: '1',
            name: role === 'farmer' ? 'Demo Farmer' : 'Demo Consumer',
            email: `demo${role}@agroconnect.com`,
            role: role,
            farmerProfile: role === 'farmer' ? {
                farmName: 'Green Valley Farm',
                farmSize: '10',
                description: 'Organic farming since 2010'
            } : null
        }

        const demoToken = 'demo-token-' + Date.now()

        // Simulate login success
        localStorage.setItem('token', demoToken)
        localStorage.setItem('user', JSON.stringify(demoUser))

        // Manually dispatch login success (since we don't have backend)
        // This is a hack for demo purposes
        window.location.reload() // Simple way to trigger auth state update

        setIsLoading(false)
    }

    const handleLogout = () => {
        logout()
    }

    if (isAuthenticated) {
        return (
            <div className="fixed top-20 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs z-50">
                <h3 className="font-semibold text-gray-900 mb-2">Quick Login</h3>
                <div className="mb-3">
                    <div className="text-sm text-green-600 mb-1">✅ Logged in as:</div>
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600"
                >
                    Logout
                </button>
                <div className="mt-2 text-xs text-gray-500">
                    Now you can access dashboard routes!
                </div>
            </div>
        )
    }

    return (
        <div className="fixed top-20 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs z-50">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Login</h3>
            <p className="text-xs text-gray-600 mb-3">
                Login to access dashboard routes like /dashboard/profile
            </p>

            <div className="space-y-2">
                <button
                    onClick={() => handleDemoLogin('farmer')}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                >
                    {isLoading ? 'Logging in...' : 'Login as Farmer'}
                </button>

                <button
                    onClick={() => handleDemoLogin('consumer')}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Logging in...' : 'Login as Consumer'}
                </button>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                <p>Demo login - no backend required</p>
            </div>
        </div>
    )
}

export default QuickLogin