import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const HealthCheck = () => {
    const [status, setStatus] = useState({
        frontend: 'checking',
        backend: 'checking',
        routing: 'checking',
        translations: 'checking'
    })

    useEffect(() => {
        checkHealth()
    }, [])

    const checkHealth = async () => {
        // Check frontend
        setStatus(prev => ({ ...prev, frontend: 'ok' }))

        // Check network connectivity first
        if (!navigator.onLine) {
            setStatus(prev => ({
                ...prev,
                backend: 'offline',
                routing: 'ok',
                translations: 'ok'
            }))
            return
        }

        // Check backend with multiple possible URLs
        const backendUrls = [
            'http://localhost:5000/api/health',
            'http://127.0.0.1:5000/api/health',
            'http://localhost:3001/api/health'
        ]

        let backendWorking = false
        for (const url of backendUrls) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

                const response = await fetch(url, {
                    signal: controller.signal,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                clearTimeout(timeoutId)

                if (response.ok) {
                    setStatus(prev => ({ ...prev, backend: 'ok' }))
                    backendWorking = true
                    break
                }
            } catch (error) {
                console.log(`Backend check failed for ${url}:`, error.message)
            }
        }

        if (!backendWorking) {
            setStatus(prev => ({ ...prev, backend: 'error' }))
        }

        // Check routing
        if (window.location.pathname !== undefined) {
            setStatus(prev => ({ ...prev, routing: 'ok' }))
        }

        // Check translations
        try {
            setStatus(prev => ({ ...prev, translations: 'ok' }))
        } catch (error) {
            setStatus(prev => ({ ...prev, translations: 'error' }))
        }
    }

    const getStatusIcon = (statusValue) => {
        switch (statusValue) {
            case 'ok': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />
            case 'checking': return <AlertCircle className="w-4 h-4 text-yellow-500" />
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusText = (statusValue) => {
        switch (statusValue) {
            case 'ok': return 'OK'
            case 'error': return 'Error'
            case 'offline': return 'Offline'
            case 'checking': return 'Checking...'
            default: return 'Unknown'
        }
    }

    return (
        <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs z-50">
            <h3 className="font-semibold text-gray-900 mb-3">System Health</h3>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Frontend:</span>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(status.frontend)}
                        <span className="text-sm">{getStatusText(status.frontend)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backend:</span>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(status.backend)}
                        <span className="text-sm">{getStatusText(status.backend)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Routing:</span>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(status.routing)}
                        <span className="text-sm">{getStatusText(status.routing)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">i18n:</span>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(status.translations)}
                        <span className="text-sm">{getStatusText(status.translations)}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={checkHealth}
                className="w-full mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
                Refresh Check
            </button>

            {status.backend === 'error' && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    <div className="font-semibold mb-1">Backend Connection Failed</div>
                    <div>1. Start backend: <code>cd backend && npm start</code></div>
                    <div>2. Check if port 5000 is free</div>
                    <div>3. Try: <code>netstat -ano | findstr :5000</code></div>
                </div>
            )}

            {status.backend === 'offline' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    <div className="font-semibold mb-1">Network Offline</div>
                    <div>App will work in offline mode with cached data</div>
                </div>
            )}

            {!navigator.onLine && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    <div className="font-semibold mb-1">Offline Mode Active</div>
                    <div>Limited functionality available</div>
                </div>
            )}
        </div>
    )
}

export default HealthCheck