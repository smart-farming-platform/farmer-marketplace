class WeatherService {
    constructor() {
        this.apiKey = 'demo_key' // In production, use environment variable
        this.baseUrl = 'https://api.openweathermap.org/data/2.5'
        this.geoApiUrl = 'https://api.openweathermap.org/geo/1.0'
        this.cache = new Map()
        this.cacheTimeout = 10 * 60 * 1000 // 10 minutes
    }

    // Get location name from coordinates using reverse geocoding
    async getLocationName(lat, lon) {
        try {
            // For demo, return mock location names based on coordinates
            return this.getMockLocationName(lat, lon)
        } catch (error) {
            console.error('Geocoding error:', error)
            return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
        }
    }

    // Enhanced weather data with GPS integration
    async getGPSWeather(lat, lon) {
        const cacheKey = `gps_weather_${lat.toFixed(4)}_${lon.toFixed(4)}`
        const cached = this.cache.get(cacheKey)

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data
        }

        try {
            // Get location name
            const locationName = await this.getLocationName(lat, lon)

            // Get current weather and forecast
            const [currentWeather, forecast] = await Promise.all([
                this.getCurrentWeather(lat, lon),
                this.getForecast(lat, lon)
            ])

            // Enhanced weather data with GPS info
            const gpsWeatherData = {
                ...currentWeather,
                location: locationName,
                coordinates: { lat, lon },
                forecast,
                farmingAdvice: this.generateLocationSpecificAdvice(lat, lon, currentWeather),
                nearbyWeatherStations: this.getNearbyStations(lat, lon)
            }

            this.cache.set(cacheKey, {
                data: gpsWeatherData,
                timestamp: Date.now()
            })

            return gpsWeatherData
        } catch (error) {
            console.error('GPS Weather error:', error)
            return this.getFallbackGPSWeather(lat, lon)
        }
    }

    // Generate location-specific farming advice
    generateLocationSpecificAdvice(lat, lon, weather) {
        const advice = []

        // Climate zone detection based on latitude
        const climateZone = this.getClimateZone(lat)

        // Seasonal advice based on location and date
        const season = this.getCurrentSeason(lat)
        const month = new Date().getMonth()

        // Temperature-based advice
        if (weather.temperature > 35) {
            advice.push({
                type: 'heat_protection',
                priority: 'high',
                message: `Extreme heat (${weather.temperature}°C) detected. Provide shade cloth for sensitive crops.`,
                icon: '🌡️',
                action: 'Install shade nets, increase irrigation frequency'
            })
        }

        // Humidity and disease prevention
        if (weather.humidity > 85) {
            advice.push({
                type: 'disease_prevention',
                priority: 'medium',
                message: `High humidity (${weather.humidity}%) increases fungal disease risk.`,
                icon: '🍄',
                action: 'Improve air circulation, apply preventive fungicides'
            })
        }

        // Wind protection
        if (weather.windSpeed > 20) {
            advice.push({
                type: 'wind_protection',
                priority: 'medium',
                message: `Strong winds (${weather.windSpeed} km/h) may damage crops.`,
                icon: '💨',
                action: 'Install windbreaks, secure greenhouse structures'
            })
        }

        // Seasonal planting advice
        if (climateZone === 'tropical' && season === 'monsoon') {
            advice.push({
                type: 'seasonal_planting',
                priority: 'low',
                message: 'Monsoon season - ideal for rice and water-loving crops.',
                icon: '🌾',
                action: 'Plant rice, sugarcane, or leafy vegetables'
            })
        }

        // UV protection
        if (weather.uvIndex > 8) {
            advice.push({
                type: 'uv_protection',
                priority: 'medium',
                message: `High UV index (${weather.uvIndex}). Protect workers and sensitive crops.`,
                icon: '☀️',
                action: 'Use UV-protective covers, schedule work for early morning/evening'
            })
        }

        return advice
    }

    // Get climate zone based on latitude
    getClimateZone(lat) {
        if (Math.abs(lat) < 23.5) return 'tropical'
        if (Math.abs(lat) < 35) return 'subtropical'
        if (Math.abs(lat) < 50) return 'temperate'
        return 'cold'
    }

    // Get current season based on latitude and date
    getCurrentSeason(lat) {
        const month = new Date().getMonth()
        const isNorthern = lat > 0

        if (isNorthern) {
            if (month >= 2 && month <= 4) return 'spring'
            if (month >= 5 && month <= 7) return 'summer'
            if (month >= 8 && month <= 10) return 'autumn'
            return 'winter'
        } else {
            if (month >= 2 && month <= 4) return 'autumn'
            if (month >= 5 && month <= 7) return 'winter'
            if (month >= 8 && month <= 10) return 'spring'
            return 'summer'
        }
    }

    // Get nearby weather stations (mock data)
    getNearbyStations(lat, lon) {
        return [
            {
                name: 'Agricultural Station A',
                distance: '2.3 km',
                coordinates: { lat: lat + 0.02, lon: lon + 0.01 },
                lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
                name: 'Meteorological Station B',
                distance: '5.7 km',
                coordinates: { lat: lat - 0.03, lon: lon + 0.02 },
                lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString()
            }
        ]
    }

    // Enhanced mock location names based on coordinates
    getMockLocationName(lat, lon) {
        // India regions
        if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
            if (lat >= 12 && lat <= 14 && lon >= 79 && lon <= 81) return 'Chennai Region, Tamil Nadu'
            if (lat >= 11 && lat <= 13 && lon >= 76 && lon <= 78) return 'Bangalore Region, Karnataka'
            if (lat >= 10 && lat <= 12 && lon >= 76 && lon <= 77) return 'Coimbatore Region, Tamil Nadu'
            if (lat >= 28 && lat <= 29 && lon >= 76 && lon <= 78) return 'Delhi Region'
            if (lat >= 18 && lat <= 20 && lon >= 72 && lon <= 74) return 'Mumbai Region, Maharashtra'
            return 'Agricultural Region, India'
        }

        // US regions
        if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
            if (lat >= 40 && lat <= 41 && lon >= -74 && lon <= -73) return 'New York Agricultural Area'
            if (lat >= 33 && lat <= 35 && lon >= -119 && lon <= -117) return 'Los Angeles Farm Region'
            if (lat >= 41 && lat <= 42 && lon >= -88 && lon <= -87) return 'Chicago Agricultural Zone'
            return 'Agricultural Region, USA'
        }

        // Default
        return `Farm Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`
    }

    // Fallback GPS weather data
    getFallbackGPSWeather(lat, lon) {
        return {
            location: this.getMockLocationName(lat, lon),
            coordinates: { lat, lon },
            temperature: 25,
            humidity: 65,
            windSpeed: 10,
            precipitation: 0,
            condition: 'sunny',
            pressure: 1013,
            uvIndex: 5,
            visibility: 10,
            timestamp: new Date().toISOString(),
            forecast: this.getFallbackForecast(),
            farmingAdvice: [
                {
                    type: 'general',
                    priority: 'low',
                    message: 'Weather data unavailable. Monitor local conditions.',
                    icon: '📡',
                    action: 'Check local weather stations or use manual observations'
                }
            ],
            nearbyWeatherStations: []
        }
    }

    // Get current weather for location
    async getCurrentWeather(lat, lon) {
        const cacheKey = `current_${lat}_${lon}`
        const cached = this.cache.get(cacheKey)

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data
        }

        try {
            // For demo purposes, return mock data
            const mockWeather = this.generateMockWeather(lat, lon)

            this.cache.set(cacheKey, {
                data: mockWeather,
                timestamp: Date.now()
            })

            return mockWeather
        } catch (error) {
            console.error('Weather API error:', error)
            return this.getFallbackWeather()
        }
    }

    // Get 5-day forecast
    async getForecast(lat, lon) {
        const cacheKey = `forecast_${lat}_${lon}`
        const cached = this.cache.get(cacheKey)

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data
        }

        try {
            const mockForecast = this.generateMockForecast(lat, lon)

            this.cache.set(cacheKey, {
                data: mockForecast,
                timestamp: Date.now()
            })

            return mockForecast
        } catch (error) {
            console.error('Forecast API error:', error)
            return this.getFallbackForecast()
        }
    }

    // Generate farming recommendations based on weather
    generateFarmingRecommendations(weather, forecast) {
        const recommendations = []
        const alerts = []

        // Temperature-based recommendations
        if (weather.temperature > 35) {
            recommendations.push({
                type: 'irrigation',
                priority: 'high',
                message: 'High temperature detected. Increase irrigation frequency.',
                icon: '💧'
            })
            alerts.push({
                type: 'heat_warning',
                severity: 'warning',
                message: 'Heat stress risk for crops. Provide shade if possible.'
            })
        }

        // Humidity recommendations
        if (weather.humidity > 80) {
            recommendations.push({
                type: 'disease_prevention',
                priority: 'medium',
                message: 'High humidity may increase fungal disease risk.',
                icon: '🍄'
            })
        }

        // Rain predictions
        const rainDays = forecast.filter(day => day.precipitation > 5).length
        if (rainDays >= 3) {
            recommendations.push({
                type: 'harvest',
                priority: 'high',
                message: 'Heavy rain expected. Consider early harvest for ready crops.',
                icon: '🌧️'
            })
        }

        // Wind warnings
        if (weather.windSpeed > 25) {
            alerts.push({
                type: 'wind_warning',
                severity: 'warning',
                message: 'Strong winds detected. Secure greenhouse structures.'
            })
        }

        // Optimal planting conditions
        if (weather.temperature >= 18 && weather.temperature <= 25 &&
            weather.humidity >= 60 && weather.humidity <= 75) {
            recommendations.push({
                type: 'planting',
                priority: 'low',
                message: 'Ideal conditions for planting most vegetables.',
                icon: '🌱'
            })
        }

        return { recommendations, alerts }
    }

    // Enhanced mock weather data generator based on location
    generateMockWeather(lat, lon) {
        // Generate realistic temperature based on latitude and season
        const baseTemp = this.getBaseTemperature(lat)
        const seasonalAdjustment = this.getSeasonalAdjustment(lat)
        const timeOfDayAdjustment = this.getTimeOfDayAdjustment()

        const temperature = Math.round(baseTemp + seasonalAdjustment + timeOfDayAdjustment + (Math.random() - 0.5) * 6)

        // Generate realistic conditions based on location and season
        const condition = this.getRealisticCondition(lat, lon)

        // Generate humidity based on location (coastal vs inland)
        const humidity = this.getRealisticHumidity(lat, lon, condition)

        return {
            location: this.getMockLocationName(lat, lon),
            temperature: Math.max(0, Math.min(50, temperature)), // Clamp between 0-50°C
            humidity: humidity,
            windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
            precipitation: condition === 'rainy' ? Math.round(1 + Math.random() * 15) : 0,
            condition: condition,
            pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 hPa
            uvIndex: this.getUVIndex(lat, condition),
            visibility: condition === 'rainy' ? Math.round(2 + Math.random() * 8) : Math.round(10 + Math.random() * 15),
            timestamp: new Date().toISOString(),
            feelsLike: Math.round(temperature + (humidity > 70 ? 2 : -1)),
            dewPoint: Math.round(temperature - ((100 - humidity) / 5))
        }
    }

    // Get base temperature based on latitude (climate zones)
    getBaseTemperature(lat) {
        const absLat = Math.abs(lat)

        if (absLat < 10) return 28 // Equatorial
        if (absLat < 23.5) return 26 // Tropical
        if (absLat < 35) return 22 // Subtropical
        if (absLat < 50) return 15 // Temperate
        if (absLat < 60) return 8 // Cold temperate
        return 0 // Polar
    }

    // Get seasonal temperature adjustment
    getSeasonalAdjustment(lat) {
        const month = new Date().getMonth()
        const isNorthern = lat > 0

        // Seasonal variation (simplified)
        let seasonalTemp = 0

        if (isNorthern) {
            // Northern hemisphere
            if (month >= 5 && month <= 7) seasonalTemp = 8 // Summer
            else if (month >= 11 || month <= 1) seasonalTemp = -8 // Winter
            else if (month >= 2 && month <= 4) seasonalTemp = 2 // Spring
            else seasonalTemp = 0 // Autumn
        } else {
            // Southern hemisphere (opposite seasons)
            if (month >= 11 || month <= 1) seasonalTemp = 8 // Summer
            else if (month >= 5 && month <= 7) seasonalTemp = -8 // Winter
            else if (month >= 8 && month <= 10) seasonalTemp = 2 // Spring
            else seasonalTemp = 0 // Autumn
        }

        return seasonalTemp
    }

    // Get time of day temperature adjustment
    getTimeOfDayAdjustment() {
        const hour = new Date().getHours()

        if (hour >= 6 && hour <= 8) return -3 // Early morning
        if (hour >= 9 && hour <= 11) return 2 // Late morning
        if (hour >= 12 && hour <= 15) return 5 // Afternoon (hottest)
        if (hour >= 16 && hour <= 18) return 2 // Evening
        if (hour >= 19 && hour <= 21) return -1 // Night
        return -4 // Late night/early morning
    }

    // Get realistic weather condition based on location
    getRealisticCondition(lat, lon) {
        const month = new Date().getMonth()
        const absLat = Math.abs(lat)

        // Tropical regions - more rain during monsoon
        if (absLat < 23.5) {
            if (month >= 5 && month <= 9) {
                return Math.random() < 0.4 ? 'rainy' : (Math.random() < 0.5 ? 'cloudy' : 'partly_cloudy')
            }
            return Math.random() < 0.7 ? 'sunny' : 'partly_cloudy'
        }

        // Temperate regions - more varied weather
        if (absLat < 50) {
            const conditions = ['sunny', 'partly_cloudy', 'cloudy', 'rainy']
            const weights = [0.4, 0.3, 0.2, 0.1] // Favor sunny weather

            const random = Math.random()
            let cumulative = 0

            for (let i = 0; i < conditions.length; i++) {
                cumulative += weights[i]
                if (random < cumulative) return conditions[i]
            }
        }

        // Default
        return 'sunny'
    }

    // Get realistic humidity based on location
    getRealisticHumidity(lat, lon, condition) {
        let baseHumidity = 60

        // Coastal areas tend to be more humid
        const absLat = Math.abs(lat)
        if (absLat < 23.5) baseHumidity = 75 // Tropical

        // Adjust based on weather condition
        if (condition === 'rainy') baseHumidity += 15
        else if (condition === 'sunny') baseHumidity -= 10

        // Add some randomness
        baseHumidity += (Math.random() - 0.5) * 20

        return Math.max(30, Math.min(95, Math.round(baseHumidity)))
    }

    // Get UV index based on latitude and conditions
    getUVIndex(lat, condition) {
        const absLat = Math.abs(lat)
        let baseUV = 8

        if (absLat < 23.5) baseUV = 10 // Tropical
        else if (absLat < 35) baseUV = 8 // Subtropical
        else if (absLat < 50) baseUV = 6 // Temperate
        else baseUV = 4 // Higher latitudes

        // Adjust for weather conditions
        if (condition === 'cloudy' || condition === 'rainy') baseUV = Math.round(baseUV * 0.3)
        else if (condition === 'partly_cloudy') baseUV = Math.round(baseUV * 0.7)

        // Time of day adjustment
        const hour = new Date().getHours()
        if (hour < 8 || hour > 18) baseUV = 0
        else if (hour >= 10 && hour <= 14) baseUV = Math.round(baseUV * 1.2)

        return Math.max(0, Math.min(11, baseUV))
    }

    generateMockForecast(lat, lon) {
        const forecast = []
        const today = new Date()

        for (let i = 0; i < 5; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)

            forecast.push({
                date: date.toISOString().split('T')[0],
                temperature: {
                    min: Math.round(15 + Math.random() * 10),
                    max: Math.round(25 + Math.random() * 15)
                },
                humidity: Math.round(40 + Math.random() * 40),
                precipitation: Math.round(Math.random() * 15),
                windSpeed: Math.round(Math.random() * 25),
                condition: ['sunny', 'cloudy', 'rainy', 'partly_cloudy'][Math.floor(Math.random() * 4)]
            })
        }

        return forecast
    }

    getLocationName(lat, lon) {
        // Mock location names based on coordinates
        const locations = [
            'Chennai, Tamil Nadu',
            'Bangalore, Karnataka',
            'Coimbatore, Tamil Nadu',
            'Salem, Tamil Nadu',
            'Madurai, Tamil Nadu'
        ]
        return locations[Math.floor(Math.random() * locations.length)]
    }

    getFallbackWeather() {
        return {
            location: 'Unknown Location',
            temperature: 25,
            humidity: 65,
            windSpeed: 10,
            precipitation: 0,
            condition: 'sunny',
            pressure: 1013,
            uvIndex: 5,
            visibility: 10,
            timestamp: new Date().toISOString()
        }
    }

    getFallbackForecast() {
        const forecast = []
        const today = new Date()

        for (let i = 0; i < 5; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)

            forecast.push({
                date: date.toISOString().split('T')[0],
                temperature: { min: 20, max: 30 },
                humidity: 60,
                precipitation: 0,
                windSpeed: 10,
                condition: 'sunny'
            })
        }

        return forecast
    }

    // Get weather icon based on condition
    getWeatherIcon(condition) {
        const icons = {
            sunny: '☀️',
            cloudy: '☁️',
            rainy: '🌧️',
            partly_cloudy: '⛅',
            stormy: '⛈️',
            foggy: '🌫️',
            snowy: '❄️'
        }
        return icons[condition] || '🌤️'
    }

    // Get weather color theme
    getWeatherTheme(condition) {
        const themes = {
            sunny: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
            cloudy: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
            rainy: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
            partly_cloudy: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' }
        }
        return themes[condition] || themes.sunny
    }
}

export default new WeatherService()