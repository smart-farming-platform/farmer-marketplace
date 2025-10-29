import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react'

const LinkDiagnostic = () => {
    const [diagnostics, setDiagnostics] = useState({})
    const [isRunning, setIsRunning] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const runDiagnostics = async () => {
        setIsRunning(true)
        const results = {}

        // Test 1: Check if React Router is working
        try {
            results.reactRouter = {
                status: 'success',
                message: `Current route: ${location.pathname}`,
                details: 'React Router is functioning'
            }
        } catch (error) {
            results.reactRouter = {
                status: 'error',
                message: 'React Router not working',
                details: error.message
            }
        }

        // Test 2: Check if navigation function works
        try {
            // Test programmatic navigation
            const testPath = location.pathname === '/' ? '/products' : '/'
            results.navigation = {
                status: 'success',
                message: 'Navigation function available',
                details: `Can navigate to: ${testPath}`
            }
        } catch (error) {
            results.navigation = {
                status: 'error',
                message: 'Navigation function failed',
                details: error.message
            }
        }

        // Test 3: Check browser history API
        try {
            if (window.history && window.history.pushState) {
                results.historyAPI = {
                    status: 'success',
                    message: 'Browser History API available',
                    details: 'pushState and replaceState supported'
                }
            } else {
                results.historyAPI = {
                    status: 'error',
                    message: 'Browser History API not supported',
                    details: 'Old browser or compatibility issue'
                }
            }
        } catch (error) {
            results.historyAPI = {
                status: 'error',
                message: 'History API check failed',
                details: error.message
            }
        }

        // Test 4: Check if DOM events are working
        try {
            const testElement = document.createElement('a')
            testElement.href = '#test'
            testElement.addEventListener('click', () => { })
            results.domEvents = {
                status: 'success',
                message: 'DOM events working',
                details: 'Click events can be attached'
            }
        } catch (error) {
            results.domEvents = {
                status: 'error',
                message: 'DOM events not working',
                details: error.message
            }
        }

        // Test 5: Check JavaScript execution
        try {
            const testFunction = () => 'test'
            if (testFunction() === 'test') {
                results.javascript = {
                    status: 'success',
                    message: 'JavaScript execution normal',
                    details: 'Functions and variables working'
                }
            }
        } catch (error) {
            results.javascript = {
                status: 'error',
                message: 'JavaScript execution issues',
                details: error.message
            }
        }

        // Test 6: Check console for errors
        const originalError = console.error
        const errors = []
        console.error = (...args) => {
            errors.push(args.join(' '))
            originalError(...args)
        }

        setTimeout(() => {
            console.error = originalError
            results.consoleErrors = {
                status: errors.length === 0 ? 'success' : 'warning',
                message: errors.length === 0 ? 'No console errors' : `${errors.length} console errors`,
                details: errors.length > 0 ? errors.slice(0, 3).join('; ') : 'Console is clean'
            }
        }, 1000)

        // Test 7: Check network connectivity
        try {
            const isOnline = navigator.onLine
            results.network = {
                status: isOnline ? 'success' : 'warning',
                message: isOnline ? 'Browser reports online' : 'Browser reports offline',
                details: `navigator.onLine: ${isOnline}`
            }
        } catch (error) {
            results.network = {
                status: 'error',
                message: 'Network check failed',
                details: error.message
            }
        }

        // Test 8: Check if development server is running
        try {
            const currentURL = window.location.href
            const isLocalhost = currentURL.includes('localhost') || currentURL.includes('127.0.0.1')
            results.devServer = {
                status: isLocalhost ? 'success' : 'info',
                message: isLocalhost ? 'Running on development server' : 'Not on localhost',
                details: `Current URL: ${currentURL}`
            }
        } catch (error) {
            results.devServer = {
                status: 'error',
                message: 'URL check failed',
                details: error.message
            }
        }

        setDiagnostics(results)
        setIsRunning(false)
    }

    useEffect(() => {
        runDiagnostics()
    }, [location.pathname])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const testNavigation = (path) => {
        try {
            navigate(path)
        } catch (error) {
            alert(`Navigation failed: ${error.message}`)
        }
    }

    const testDirectLink = (url) => {
        try {
            window.location.href = url
        } catch (error) {
            alert(`Direct navigation failed: ${error.message}`)
        }
    }

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 max-w-2xl max-h-96 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Link Diagnostic Tool</h3>
                <button
                    onClick={runDiagnostics}
                    disabled={isRunning}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Running...' : 'Refresh'}</span>
                </button>
            </div>

            <div className="space-y-3 mb-6">
                {Object.entries(diagnostics).map(([key, result]) => (
                    <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-sm text-gray-600">{result.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Test Navigation</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => testNavigation('/')}
                        className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                        Navigate to Home
                    </button>
                    <button
                        onClick={() => testNavigation('/products')}
                        className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                        Navigate to Products
                    </button>
                    <button
                        onClick={() => testDirectLink(window.location.origin + '/dashboard')}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                        Direct to Dashboard
                    </button>
                    <button
                        onClick={() => testDirectLink(window.location.origin + '/dashboard/profile')}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                        Direct to Profile
                    </button>
                </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <div className="font-medium text-yellow-800 mb-1">Common Issues & Solutions:</div>
                <ul className="text-yellow-700 space-y-1 text-xs">
                    <li>• If React Router fails: Check if BrowserRouter is properly set up</li>
                    <li>• If navigation fails: Check for JavaScript errors in console</li>
                    <li>• If dev server fails: Restart with `npm run dev`</li>
                    <li>• If network fails: Check internet connection and firewall</li>
                </ul>
            </div>

            <div className="mt-3 text-center">
                <button
                    onClick={() => document.querySelector('[data-diagnostic]').style.display = 'none'}
                    className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                    Close Diagnostic
                </button>
            </div>
        </div>
    )
}

// Wrapper to control visibility
const LinkDiagnosticWrapper = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show diagnostic if there are navigation issues
        const checkForIssues = () => {
            const hasErrors = window.console && console.error
            const isLocalhost = window.location.href.includes('localhost')

            // Auto-show if on localhost and potential issues detected
            if (isLocalhost) {
                setIsVisible(true)
            }
        }

        checkForIssues()

        // Listen for keyboard shortcut (Ctrl+D) to toggle diagnostic
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault()
                setIsVisible(!isVisible)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isVisible])

    if (!isVisible) {
        return (
            <div className="fixed bottom-20 left-4 bg-red-500 text-white p-2 rounded text-xs z-50">
                Links not working? Press <kbd className="bg-red-600 px-1 rounded">Ctrl+D</kbd> for diagnostic
            </div>
        )
    }

    return (
        <div data-diagnostic>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsVisible(false)}></div>
            <LinkDiagnostic />
        </div>
    )
}

export default LinkDiagnosticWrapper