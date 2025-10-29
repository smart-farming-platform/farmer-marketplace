import networkService from '../services/networkService'

export const initializeApp = async () => {
    console.log('🚀 Initializing AgroConnect...')

    // Check network status
    const networkStatus = networkService.getNetworkStatus()
    console.log('📡 Network Status:', networkStatus)

    // Try to find working backend
    if (networkStatus.isOnline) {
        console.log('🔍 Looking for backend server...')
        const workingBackend = await networkService.findWorkingBackend()

        if (workingBackend) {
            console.log('✅ Backend found at:', workingBackend)
        } else {
            console.log('⚠️ No backend found, running in offline mode')
        }
    } else {
        console.log('📴 Device is offline, using cached data')
    }

    // Initialize offline data
    initializeOfflineData()

    console.log('✅ AgroConnect initialized successfully')
    return true
}

const initializeOfflineData = () => {
    // Ensure we have some basic data for offline use
    const offlineData = {
        products: [
            { id: 1, name: 'Fresh Tomatoes', price: 120, category: 'vegetables', farmer: 'Green Valley Farm', image: '/images/tomatoes.jpg' },
            { id: 2, name: 'Sweet Corn', price: 15, category: 'vegetables', farmer: 'Sunny Acres', image: '/images/corn.jpg' },
            { id: 3, name: 'Organic Strawberries', price: 180, category: 'fruits', farmer: 'Berry Best Farm', image: '/images/strawberries.jpg' },
            { id: 4, name: 'Fresh Lettuce', price: 40, category: 'vegetables', farmer: 'Green Leaf Co', image: '/images/lettuce.jpg' },
            { id: 5, name: 'Farm Fresh Eggs', price: 150, category: 'dairy', farmer: 'Happy Hens Farm', image: '/images/eggs.jpg' },
            { id: 6, name: 'Organic Carrots', price: 80, category: 'vegetables', farmer: 'Root & Stem', image: '/images/carrots.jpg' }
        ],
        farmers: [
            { id: 1, name: 'Green Valley Farm', location: 'Chennai, Tamil Nadu', distance: 2.5, rating: 4.8, products: 15 },
            { id: 2, name: 'Sunny Acres', location: 'Coimbatore, Tamil Nadu', distance: 5.2, rating: 4.6, products: 12 },
            { id: 3, name: 'Berry Best Farm', location: 'Salem, Tamil Nadu', distance: 8.1, rating: 4.9, products: 8 },
            { id: 4, name: 'Green Leaf Co', location: 'Madurai, Tamil Nadu', distance: 12.3, rating: 4.5, products: 20 },
            { id: 5, name: 'Happy Hens Farm', location: 'Trichy, Tamil Nadu', distance: 15.7, rating: 4.7, products: 6 }
        ],
        user: {
            name: 'Demo User',
            email: 'demo@agroconnect.com',
            location: 'Chennai, Tamil Nadu'
        }
    }

    // Store in localStorage if not already present
    Object.keys(offlineData).forEach(key => {
        const storageKey = `agroconnect_${key}`
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, JSON.stringify(offlineData[key]))
        }
    })
}

export const getOfflineProducts = () => {
    try {
        const products = localStorage.getItem('agroconnect_products')
        return products ? JSON.parse(products) : []
    } catch (error) {
        console.error('Error getting offline products:', error)
        return []
    }
}

export const getOfflineFarmers = () => {
    try {
        const farmers = localStorage.getItem('agroconnect_farmers')
        return farmers ? JSON.parse(farmers) : []
    } catch (error) {
        console.error('Error getting offline farmers:', error)
        return []
    }
}

export const checkSystemRequirements = () => {
    const requirements = {
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        geolocation: 'geolocation' in navigator,
        serviceWorker: 'serviceWorker' in navigator,
        webSpeech: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    }

    console.log('🔧 System Requirements Check:', requirements)
    return requirements
}

export const getStartupInfo = () => {
    return {
        appName: 'AgroConnect',
        version: '1.0.0',
        buildTime: new Date().toISOString(),
        features: [
            'Offline-first architecture',
            'Multi-language support (6 languages)',
            'Voice interaction',
            'GPS-based farmer discovery',
            'Smart weather integration',
            'AI-powered crop recommendations',
            'QR code scanning',
            'Real-time market intelligence'
        ],
        networkStatus: networkService.getNetworkStatus(),
        systemRequirements: checkSystemRequirements()
    }
}