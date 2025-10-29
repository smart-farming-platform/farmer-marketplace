class NetworkService {
    constructor() {
        this.isOnline = navigator.onLine
        this.baseURL = this.detectBaseURL()
        this.retryAttempts = 3
        this.retryDelay = 1000

        // Listen for network changes
        window.addEventListener('online', () => {
            this.isOnline = true
            console.log('Network: Back online')
        })

        window.addEventListener('offline', () => {
            this.isOnline = false
            console.log('Network: Gone offline')
        })
    }

    detectBaseURL() {
        // Try different possible backend URLs
        const possibleURLs = [
            'http://localhost:5000',
            'http://127.0.0.1:5000',
            'http://localhost:3001',
            'http://127.0.0.1:3001'
        ]

        // Return the first one for now, we'll test them dynamically
        return possibleURLs[0]
    }

    async testConnection(url = null) {
        const testURL = url || `${this.baseURL}/api/health`

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(testURL, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            clearTimeout(timeoutId)
            return response.ok
        } catch (error) {
            console.log('Connection test failed:', error.message)
            return false
        }
    }

    async findWorkingBackend() {
        const possibleURLs = [
            'http://localhost:5000',
            'http://127.0.0.1:5000',
            'http://localhost:3001',
            'http://127.0.0.1:3001'
        ]

        for (const baseURL of possibleURLs) {
            const isWorking = await this.testConnection(`${baseURL}/api/health`)
            if (isWorking) {
                this.baseURL = baseURL
                console.log(`Found working backend at: ${baseURL}`)
                return baseURL
            }
        }

        console.log('No working backend found')
        return null
    }

    async makeRequest(endpoint, options = {}) {
        // If offline, return cached data or mock data
        if (!this.isOnline) {
            console.log('Offline: Using cached/mock data for', endpoint)
            return this.getOfflineData(endpoint)
        }

        // Find working backend if not already found
        if (!await this.testConnection()) {
            await this.findWorkingBackend()
        }

        const url = `${this.baseURL}${endpoint}`

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                })

                clearTimeout(timeoutId)

                if (response.ok) {
                    const data = await response.json()
                    // Cache successful responses
                    this.cacheData(endpoint, data)
                    return data
                }

                throw new Error(`HTTP ${response.status}: ${response.statusText}`)

            } catch (error) {
                console.log(`Request attempt ${attempt} failed:`, error.message)

                if (attempt === this.retryAttempts) {
                    // Final attempt failed, return cached data
                    console.log('All attempts failed, using cached data')
                    return this.getOfflineData(endpoint)
                }

                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
            }
        }
    }

    cacheData(endpoint, data) {
        try {
            const cacheKey = `agroconnect_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }))
        } catch (error) {
            console.log('Failed to cache data:', error)
        }
    }

    getOfflineData(endpoint) {
        try {
            const cacheKey = `agroconnect_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`
            const cached = localStorage.getItem(cacheKey)

            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                const age = Date.now() - timestamp

                // Use cached data if less than 1 hour old
                if (age < 60 * 60 * 1000) {
                    return data
                }
            }
        } catch (error) {
            console.log('Failed to get cached data:', error)
        }

        // Return mock data as fallback
        return this.getMockData(endpoint)
    }

    getMockData(endpoint) {
        const mockData = {
            '/api/health': { status: 'OK', message: 'Mock health check' },
            '/api/products': {
                success: true,
                data: [
                    { id: 1, name: 'Fresh Tomatoes', price: 120, category: 'vegetables', image: 'tomatoes.svg' },
                    { id: 2, name: 'Sweet Corn', price: 15, category: 'vegetables', image: 'corn.svg' },
                    { id: 3, name: 'Organic Strawberries', price: 180, category: 'fruits', image: 'strawberries.svg' }
                ]
            },
            '/api/farmers': {
                success: true,
                data: [
                    { id: 1, name: 'Green Valley Farm', location: 'Fresno, CA', distance: 2.5 },
                    { id: 2, name: 'Smith Family Farm', location: 'Los Angeles, CA', distance: 5.2 }
                ]
            }
        }

        return mockData[endpoint] || { success: false, message: 'No mock data available' }
    }

    // Utility method to check if we're in development
    isDevelopment() {
        return import.meta.env.DEV || process.env.NODE_ENV === 'development'
    }

    // Get current network status
    getNetworkStatus() {
        return {
            isOnline: this.isOnline,
            baseURL: this.baseURL,
            browserOnline: navigator.onLine
        }
    }
}

export default new NetworkService()