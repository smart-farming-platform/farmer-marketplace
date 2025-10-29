import { useState, useEffect } from 'react'

export const useOfflineData = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [cachedProducts, setCachedProducts] = useState([])

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Load cached data
        loadCachedData()

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const loadCachedData = () => {
        try {
            const cached = localStorage.getItem('agroconnect_offline_data')
            if (cached) {
                const data = JSON.parse(cached)
                setCachedProducts(data.products || [])
            }
        } catch (error) {
            console.error('Error loading cached data:', error)
        }
    }

    const addToOfflineCart = (product, quantity = 1) => {
        try {
            // Get existing cart
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')

            // Check if product already in cart
            const existingIndex = existingCart.findIndex(item => item.product.id === product.id)

            if (existingIndex >= 0) {
                existingCart[existingIndex].quantity += quantity
            } else {
                existingCart.push({
                    product: product,
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                })
            }

            localStorage.setItem('cart', JSON.stringify(existingCart))

            // Store offline action for sync later
            const offlineActions = JSON.parse(localStorage.getItem('agroconnect_offline_actions') || '[]')
            offlineActions.push({
                type: 'ADD_TO_CART',
                productId: product.id,
                quantity: quantity,
                timestamp: new Date().toISOString()
            })
            localStorage.setItem('agroconnect_offline_actions', JSON.stringify(offlineActions))

            return true
        } catch (error) {
            console.error('Error adding to offline cart:', error)
            return false
        }
    }

    const getOfflineCart = () => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]')
        } catch (error) {
            console.error('Error getting offline cart:', error)
            return []
        }
    }

    return {
        isOnline,
        cachedProducts,
        addToOfflineCart,
        getOfflineCart,
        loadCachedData
    }
}