import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, TrendingUp, Bell, Sprout } from 'lucide-react'
import MarketIntelligence from '../components/market/MarketIntelligence'
import PriceAlerts from '../components/market/PriceAlerts'
import CropPlanning from '../components/market/CropPlanning'

const MarketIntelligencePage = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('intelligence')

    const tabs = [
        { id: 'intelligence', name: 'Market Intelligence', icon: BarChart3 },
        { id: 'alerts', name: 'Price Alerts', icon: Bell },
        { id: 'planning', name: 'Crop Planning', icon: Sprout }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
                            <p className="text-lg text-gray-600">
                                AI-powered market insights, price predictions & smart farming decisions
                            </p>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">87%</div>
                                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">500+</div>
                                    <div className="text-sm text-gray-600">Markets Tracked</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded">
                                    <Bell className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                                    <div className="text-sm text-gray-600">Price Monitoring</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 p-2 rounded">
                                    <Sprout className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">50+</div>
                                    <div className="text-sm text-gray-600">Crops Analyzed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'intelligence' && <MarketIntelligence />}
                    {activeTab === 'alerts' && <PriceAlerts />}
                    {activeTab === 'planning' && <CropPlanning />}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Maximize Your Farm Profits</h3>
                    <p className="text-lg mb-6 text-blue-100">
                        Join thousands of farmers using AI-powered market intelligence to increase their income by 40-60%
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                            Get Premium Insights
                        </button>
                        <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                            Schedule Expert Call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketIntelligencePage