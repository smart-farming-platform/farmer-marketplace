import { useState } from 'react'
import DualQRGenerator from '../components/scanner/DualQRGenerator'
import PaymentQRGenerator from '../components/scanner/PaymentQRGenerator'
import ProductViewQRGenerator from '../components/scanner/ProductViewQRGenerator'

const QRDemo = () => {
    const [demoProduct, setDemoProduct] = useState({
        productId: 'AGR001',
        productName: 'Organic Tomatoes',
        farmerName: 'John Smith',
        farmerId: 'F123',
        price: '5.99',
        category: 'Vegetables',
        description: 'Fresh organic tomatoes from local farm'
    })

    const handleProductChange = (field, value) => {
        setDemoProduct(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        QR Code Generator Demo
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                        Generate QR codes for product viewing and payments
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
                        <h3 className="font-semibold text-green-800 mb-2">✅ These QR codes work offline!</h3>
                        <p className="text-green-700 text-sm">
                            Scan with any smartphone camera or QR app. No internet connection required to view the information.
                            The QR codes contain all product and contact details as readable text.
                        </p>
                    </div>
                </div>

                {/* Product Configuration */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Configure Your Product
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={demoProduct.productName}
                                onChange={(e) => handleProductChange('productName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Farmer Name
                            </label>
                            <input
                                type="text"
                                value={demoProduct.farmerName}
                                onChange={(e) => handleProductChange('farmerName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                value={demoProduct.price}
                                onChange={(e) => handleProductChange('price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={demoProduct.category}
                                onChange={(e) => handleProductChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Grains">Grains</option>
                                <option value="Herbs">Herbs</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Meat">Meat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product ID
                            </label>
                            <input
                                type="text"
                                value={demoProduct.productId}
                                onChange={(e) => handleProductChange('productId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Farmer ID
                            </label>
                            <input
                                type="text"
                                value={demoProduct.farmerId}
                                onChange={(e) => handleProductChange('farmerId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={demoProduct.description}
                            onChange={(e) => handleProductChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="2"
                        />
                    </div>
                </div>

                {/* QR Code Generator */}
                <DualQRGenerator {...demoProduct} />
            </div>
        </div>
    )
}

export default QRDemo