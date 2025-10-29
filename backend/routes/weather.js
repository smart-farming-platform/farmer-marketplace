const express = require('express')
const router = express.Router()

// Mock weather data for demo purposes
const generateMockWeather = (lat, lon) => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'partly_cloudy']
    const condition = conditions[Math.floor(Math.random() * conditions.length)]

    return {
        location: getLocationName(lat, lon),
        temperature: Math.round(20 + Math.random() * 20), // 20-40°C
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        windSpeed: Math.round(Math.random() * 30), // 0-30 km/h
        precipitation: Math.round(Math.random() * 10), // 0-10mm
        condition: condition,
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        uvIndex: Math.round(Math.random() * 11), // 0-11
        visibility: Math.round(5 + Math.random() * 15), // 5-20 km
        timestamp: new Date().toISOString()
    }
}

const generateMockForecast = (lat, lon) => {
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

const getLocationName = (lat, lon) => {
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

const generateFarmingRecommendations = (weather, forecast) => {
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

// Get current weather
router.get('/current', async (req, res) => {
    try {
        const { lat = 13.0827, lon = 80.2707 } = req.query

        // In production, you would call a real weather API here
        // For demo, we'll return mock data
        const weather = generateMockWeather(parseFloat(lat), parseFloat(lon))

        res.json({
            success: true,
            data: weather
        })
    } catch (error) {
        console.error('Weather API error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather data'
        })
    }
})

// Get weather forecast
router.get('/forecast', async (req, res) => {
    try {
        const { lat = 13.0827, lon = 80.2707 } = req.query

        const forecast = generateMockForecast(parseFloat(lat), parseFloat(lon))

        res.json({
            success: true,
            data: forecast
        })
    } catch (error) {
        console.error('Forecast API error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch forecast data'
        })
    }
})

// Get farming recommendations based on weather
router.get('/recommendations', async (req, res) => {
    try {
        const { lat = 13.0827, lon = 80.2707 } = req.query

        const weather = generateMockWeather(parseFloat(lat), parseFloat(lon))
        const forecast = generateMockForecast(parseFloat(lat), parseFloat(lon))

        const { recommendations, alerts } = generateFarmingRecommendations(weather, forecast)

        res.json({
            success: true,
            data: {
                weather,
                forecast,
                recommendations,
                alerts
            }
        })
    } catch (error) {
        console.error('Recommendations API error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations'
        })
    }
})

// Get weather alerts
router.get('/alerts', async (req, res) => {
    try {
        const { lat = 13.0827, lon = 80.2707 } = req.query

        const weather = generateMockWeather(parseFloat(lat), parseFloat(lon))
        const forecast = generateMockForecast(parseFloat(lat), parseFloat(lon))

        const { alerts } = generateFarmingRecommendations(weather, forecast)

        // Add some additional demo alerts
        const additionalAlerts = []

        // Frost warning
        const coldDays = forecast.filter(day => day.temperature.min < 5)
        if (coldDays.length > 0) {
            additionalAlerts.push({
                id: 'frost_warning',
                type: 'frost_warning',
                severity: 'high',
                title: 'Frost Warning',
                message: 'Temperatures may drop below 5°C. Protect sensitive crops.',
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
        }

        // Drought conditions
        const dryDays = forecast.filter(day => day.precipitation < 1).length
        if (dryDays >= 4) {
            additionalAlerts.push({
                id: 'drought_warning',
                type: 'drought_warning',
                severity: 'medium',
                title: 'Dry Conditions',
                message: 'No significant rainfall expected for 4+ days. Plan irrigation.',
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
            })
        }

        res.json({
            success: true,
            data: [...alerts, ...additionalAlerts]
        })
    } catch (error) {
        console.error('Weather alerts API error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather alerts'
        })
    }
})

module.exports = router