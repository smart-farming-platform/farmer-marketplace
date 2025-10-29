import { Link, useNavigate } from 'react-router-dom'

const NavigationTest = () => {
    const navigate = useNavigate()

    const testNavigation = () => {
        console.log('Testing navigation...')
        navigate('/products')
    }

    return (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
            <h4 className="font-semibold mb-2">Navigation Test</h4>
            <div className="space-y-2">
                <Link
                    to="/products"
                    className="block bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400"
                >
                    Link to Products
                </Link>
                <button
                    onClick={testNavigation}
                    className="block bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-400 w-full"
                >
                    Navigate to Products
                </button>
                <button
                    onClick={() => window.location.href = '/products'}
                    className="block bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-400 w-full"
                >
                    Window Location
                </button>
            </div>
        </div>
    )
}

export default NavigationTest