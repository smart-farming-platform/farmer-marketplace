import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle, Clock, Eye, Calendar, TrendingUp } from 'lucide-react'

const DiseaseHistory = () => {
    const { t } = useTranslation()
    const [selectedPeriod, setSelectedPeriod] = useState('month')

    // Mock disease history data
    const diseaseHistory = [
        {
            id: 1,
            date: '2024-10-25',
            disease: 'Tomato Late Blight',
            crop: 'Tomato',
            severity: 'high',
            status: 'treated',
            confidence: 92,
            treatmentApplied: 'Organic + Chemical',
            outcome: 'recovered',
            costSaved: 15000,
            yieldProtected: '85%'
        },
        {
            id: 2,
            date: '2024-10-20',
            disease: 'Wheat Leaf Rust',
            crop: 'Wheat',
            severity: 'medium',
            status: 'monitoring',
            confidence: 88,
            treatmentApplied: 'Organic',
            outcome: 'improving',
            costSaved: 8000,
            yieldProtected: '70%'
        },
        {
            id: 3,
            date: '2024-10-15',
            disease: 'Rice Blast',
            crop: 'Rice',
            severity: 'low',
            status: 'resolved',
            confidence: 85,
            treatmentApplied: 'Preventive',
            outcome: 'prevented',
            costSaved: 5000,
            yieldProtected: '95%'
        }
    ]

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-100'
            case 'medium': return 'text-yellow-600 bg-yellow-100'
            case 'low': return 'text-green-600 bg-green-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'treated': return 'text-blue-600 bg-blue-100'
            case 'monitoring': return 'text-yellow-600 bg-yellow-100'
            case 'resolved': return 'text-green-600 bg-green-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getOutcomeIcon = (outcome) => {
        switch (outcome) {
            case 'recovered': return <CheckCircle className="w-5 h-5 text-green-600" />
            case 'improving': return <TrendingUp className="w-5 h-5 text-blue-600" />
            case 'prevented': return <CheckCircle className="w-5 h-5 text-green-600" />
            default: return <Clock className="w-5 h-5 text-gray-600" />
        }
    }

    const totalSavings = diseaseHistory.reduce((sum, item) => sum + item.costSaved, 0)
    const avgYieldProtected = diseaseHistory.reduce((sum, item) => sum + parseInt(item.yieldProtected), 0) / diseaseHistory.length

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Disease Detection History</h3>
                        <p className="text-sm text-gray-600">AI-powered crop health monitoring</p>
                    </div>
                </div>

                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <div className="text-2xl font-bold text-green-600">₹{totalSavings.toLocaleString()}</div>
                            <div className="text-sm text-green-700">Total Savings</div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{avgYieldProtected.toFixed(0)}%</div>
                            <div className="text-sm text-blue-700">Avg Yield Protected</div>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <Eye className="w-8 h-8 text-purple-600" />
                        <div>
                            <div className="text-2xl font-bold text-purple-600">{diseaseHistory.length}</div>
                            <div className="text-sm text-purple-700">Detections</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disease History List */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Recent Detections</span>
                </h4>

                {diseaseHistory.map((detection) => (
                    <div key={detection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h5 className="font-medium text-gray-900">{detection.disease}</h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(detection.severity)}`}>
                                        {detection.severity.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detection.status)}`}>
                                        {detection.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Crop:</span>
                                        <div className="font-medium">{detection.crop}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Confidence:</span>
                                        <div className="font-medium">{detection.confidence}%</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Treatment:</span>
                                        <div className="font-medium">{detection.treatmentApplied}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Yield Protected:</span>
                                        <div className="font-medium text-green-600">{detection.yieldProtected}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">
                                            {new Date(detection.date).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            {getOutcomeIcon(detection.outcome)}
                                            <span className="text-sm font-medium capitalize">{detection.outcome}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-green-600">
                                        Saved: ₹{detection.costSaved.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Detect New Disease</span>
                </button>
            </div>
        </div>
    )
}

export default DiseaseHistory