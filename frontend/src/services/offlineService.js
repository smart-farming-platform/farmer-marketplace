class OfflineService {
    constructor() {
        this.isOnline = navigator.onLine
        this.listeners = []
        this.cache = new Map()
        this.initializeEventListeners()
        this.initializeCache()
    }

    initializeEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true
            this.notifyListeners('online')
            this.syncOfflineData()
        })

        window.addEventListener('offline', () => {
            this.isOnline = false
            this.notifyListeners('offline')
        })
    }

    initializeCache() {
        // Load cached data from localStorage
        try {
            const cachedData = localStorage.getItem('agroconnect_offline_cache')
            if (cachedData) {
                const parsed = JSON.parse(cachedData)
                Object.entries(parsed).forEach(([key, value]) => {
                    this.cache.set(key, value)
                })
            }
        } catch (error) {
            console.error('Error loading offline cache:', error)
        }
    }

    saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })
        this.persistCache()
    }

    getFromCache(key) {
        const cached = this.cache.get(key)
        if (!cached) return null

        // Check if expired
        if (Date.now() > cached.expires) {
            this.cache.delete(key)
            this.persistCache()
            return null
        }

        return cached.data
    }

    persistCache() {
        try {
            const cacheObject = {}
            this.cache.forEach((value, key) => {
                cacheObject[key] = value
            })
            localStorage.setItem('agroconnect_offline_cache', JSON.stringify(cacheObject))
        } catch (error) {
            console.error('Error persisting cache:', error)
        }
    }

    addListener(callback) {
        this.listeners.push(callback)
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback)
    }

    notifyListeners(status) {
        this.listeners.forEach(callback => callback(status))
    }

    // Cache products for offline viewing
    cacheProducts(products) {
        this.saveToCache('products', products)
    }

    getCachedProducts() {
        return this.getFromCache('products') || []
    }

    // Cache user data
    cacheUserData(userData) {
        this.saveToCache('userData', userData)
    }

    getCachedUserData() {
        return this.getFromCache('userData')
    }

    // Cache farmers data
    cacheFarmers(farmers) {
        this.saveToCache('farmers', farmers)
    }

    getCachedFarmers() {
        return this.getFromCache('farmers') || []
    }

    // Store offline actions (like adding to cart)
    storeOfflineAction(action) {
        const offlineActions = this.getOfflineActions()
        offlineActions.push({
            ...action,
            timestamp: Date.now(),
            id: Date.now().toString()
        })
        this.saveToCache('offlineActions', offlineActions)
    }

    getOfflineActions() {
        return this.getFromCache('offlineActions') || []
    }

    clearOfflineActions() {
        this.cache.delete('offlineActions')
        this.persistCache()
    }

    // Sync offline data when back online
    async syncOfflineData() {
        const offlineActions = this.getOfflineActions()

        if (offlineActions.length === 0) return

        console.log('Syncing offline actions:', offlineActions)

        // Process each offline action
        for (const action of offlineActions) {
            try {
                await this.processOfflineAction(action)
            } catch (error) {
                console.error('Error syncing offline action:', error)
            }
        }

        // Clear processed actions
        this.clearOfflineActions()
    }

    async processOfflineAction(action) {
        switch (action.type) {
            case 'ADD_TO_CART':
                // Sync cart additions
                const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
                // Cart is already in localStorage, no API call needed
                break

            case 'SAVE_PRODUCT':
                // Sync saved products
                console.log('Syncing saved product:', action.data)
                break

            case 'UPDATE_PROFILE':
                // Sync profile updates when online
                console.log('Syncing profile update:', action.data)
                break

            default:
                console.log('Unknown offline action:', action.type)
        }
    }

    // Get cache statistics
    getCacheStats() {
        const stats = {
            totalItems: this.cache.size,
            products: this.getCachedProducts().length,
            farmers: this.getCachedFarmers().length,
            offlineActions: this.getOfflineActions().length,
            isOnline: this.isOnline,
            lastSync: this.getFromCache('lastSync') || 'Never'
        }
        return stats
    }

    // Clear all cache
    clearCache() {
        this.cache.clear()
        localStorage.removeItem('agroconnect_offline_cache')
    }
}

export default new OfflineService()