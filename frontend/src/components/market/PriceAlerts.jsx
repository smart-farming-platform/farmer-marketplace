import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, Plus, X, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react'

const PriceAlerts = () => {
    const { t } = useTranslation()
    const [showCreateAlert, setShowCreateAlert] = useState(false)
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            crop: 'Tomato',
            cropId: 'tomato',
            type: 'price_above',
            targetPrice: 50,
            currentPrice: 45,
            isActive: true,
            createdAt: '2024-10-25',
            triggeredCount: 0
        },
        {
            id: 2,
            crop: 'Onion',
            cropId: 'onion',
            type: 'price_below',
            targetPrice: 25,
            currentPrice: 28,
            isActive: true,
            createdAt: '2024-10-20',
            triggeredCount: 2
        },
        {
            id: 3,
            crop: 'Rice',
            cropId: 'rice',
            type: 'trend_change',
            targetPrice: null,
            currentPrice: 32,
            isActive: false,
            createdAt: '2024-10-15',
            triggeredCount: 1
        }
    ])

    const [newAlert, setNewAlert] = useState({
        crop: 'tomato',
        type: 'price_above',
        targetPrice: '',
        notifications: {
            sms: true,
            email: true,
            push: true
        }
    })

    const crops = [
        { id: 'tomato', name: 'Tomato', icon: '🍅' },
        { id: 'onion', name: 'Onion', icon: '🧅' },
        { id: 'potato', name: 'Potato', icon: '🥔' },
        { id: 'rice', name: 'Rice', icon: '🌾' },
        { id: 'wheat', name: 'Wheat', icon: '🌾' }
    ]

    const alertTypes = [
        { id: 'price_above', name: 'Price Above', description: 'Alert when price goes above target', icon: TrendingUp },
        { id: 'price_below', name: 'Price Below', description: 'Alert when price drops below target', icon: TrendingDown },
        { id: 'trend_change', name: 'Trend Change', description: 'Alert when market trend changes', icon: Target },
        { id: 'demand_spike', name: 'Demand Spike', description: 'Alert when demand suddenly increases', icon: AlertTriangle }
    ]

    const handleCreateAlert = () => {
        if (!newAlert.targetPrice && newAlert.type !== 'trend_change' && newAlert.type !== 'demand_spike') {
            alert('Please enter target price')
            return
        }

        const alert = {
            id: Date.now(),
            crop: crops.find(c => c.id === newAlert.crop)?.name,
            cropId: newAlert.crop,
            type: newAlert.type,
            targetPrice: parseFloat(newAlert.targetPrice) || null,
            currentPrice: Math.floor(Math.random() * 50) + 20, // Mock current price
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            triggeredCount: 0,
            notifications: newAlert.notifications
        }

        setAlerts([alert, ...alerts])
        setNewAlert({
            crop: 'tomato',
            type: 'price_above',
            targetPrice: '',
            notifications: { sms: true, email: true, push: true }
        })
        setShowCreateAlert(false)
    }

    const toggleAlert = (alertId) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId
                ? { ...alert, isActive: !alert.isActive }
                : alert
        ))
    }

    const deleteAlert = (alertId) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId))
    }

    const getAlertIcon = (type) => {
        const alertType = alertTypes.find(at => at.id === type)
        return alertType ? alertType.icon : Bell
    }

    const getAlertStatus = (alert) => {
        if (!alert.isActive) return { color: 'text-gray-500', status: 'Inactive' }

        switch (alert.type) {
            case 'price_above':
                return alert.currentPrice >= alert.targetPrice
                    ? { color: 'text-green-600', status: 'Triggered!' }
                    : { color: 'text-blue-600', status: 'Monitoring' }
            case 'price_below':
                return alert.currentPrice <= alert.targetPrice
                    ? { color: 'text-red-600', status: 'Triggered!' }
                    : { color: 'text-blue-600', status: 'Monitoring' }
            default:
                return { color: 'text-blue-600', status: 'Monitoring' }
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                        <Bell className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Price Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when market conditions change</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateAlert(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Alert</span>
                </button>
            </div>

            {/* Active Alerts */}
            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No price alerts set up yet</p>
                        <button
                            onClick={() => setShowCreateAlert(true)}
                            className="mt-2 text-yellow-600 hover:text-yellow-700"
                        >
                            Create your first alert
                        </button>
                    </div>
                ) : (
                    alerts.map((alert) => {
                        const AlertIcon = getAlertIcon(alert.type)
                        const status = getAlertStatus(alert)

                        return (
                            <div key={alert.id} className={`border rounded-lg p-4 ${alert.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${alert.isActive ? 'bg-yellow-100' : 'bg-gray-100'
                                            }`}>
                                            <AlertIcon className={`w-5 h-5 ${alert.isActive ? 'text-yellow-600' : 'text-gray-400'
                                                }`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-medium text-gray-900">{alert.crop}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} bg-opacity-10`}>
                                                    {status.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {alertTypes.find(at => at.id === alert.type)?.name}
                                                {alert.targetPrice && ` at ₹${alert.targetPrice}/kg`}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                <span>Current: ₹{alert.currentPrice}/kg</span>
                                                <span>Created: {alert.createdAt}</span>
                                                <span>Triggered: {alert.triggeredCount} times</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleAlert(alert.id)}
                                            className={`px-3 py-1 rounded text-sm font-medium ${alert.isActive
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {alert.isActive ? 'Pause' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => deleteAlert(alert.id)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Create Alert Modal */}
            {showCreateAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Create Price Alert</h3>
                                <button
                                    onClick={() => setShowCreateAlert(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Crop Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Crop
                                    </label>
                                    <select
                                        value={newAlert.crop}
                                        onChange={(e) => setNewAlert({ ...newAlert, crop: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                    >
                                        {crops.map(crop => (
                                            <option key={crop.id} value={crop.id}>
                                                {crop.icon} {crop.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Alert Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alert Type
                                    </label>
                                    <div className="space-y-2">
                                        {alertTypes.map(type => (
                                            <label key={type.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="alertType"
                                                    value={type.id}
                                                    checked={newAlert.type === type.id}
                                                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                                                    className="text-yellow-600"
                                                />
                                                <type.icon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{type.name}</p>
                                                    <p className="text-sm text-gray-600">{type.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Target Price */}
                                {(newAlert.type === 'price_above' || newAlert.type === 'price_below') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Price (₹/kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={newAlert.targetPrice}
                                            onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                                            placeholder="Enter target price"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                )}

                                {/* Notification Preferences */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Methods
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={newAlert.notifications.sms}
                                                onChange={(e) => setNewAlert({
                                                    ...newAlert,
                                                    notifications: { ...newAlert.notifications, sms: e.target.checked }
                                                })}
                                                className="text-yellow-600"
                                            />
                                            <span className="text-sm text-gray-700">SMS Alert</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={newAlert.notifications.email}
                                                onChange={(e) => setNewAlert({
                                                    ...newAlert,
                                                    notifications: { ...newAlert.notifications, email: e.target.checked }
                                                })}
                                                className="text-yellow-600"
                                            />
                                            <span className="text-sm text-gray-700">Email Alert</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={newAlert.notifications.push}
                                                onChange={(e) => setNewAlert({
                                                    ...newAlert,
                                                    notifications: { ...newAlert.notifications, push: e.target.checked }
                                                })}
                                                className="text-yellow-600"
                                            />
                                            <span className="text-sm text-gray-700">Push Notification</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCreateAlert(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateAlert}
                                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
                                >
                                    Create Alert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PriceAlerts