import { Package } from 'lucide-react'

const PlaceholderImage = ({ category, className = "w-full h-48" }) => {
    const getPlaceholderContent = (category) => {
        switch (category) {
            case 'vegetables':
                return { emoji: '🥕', bg: 'bg-green-100', text: 'text-green-600', label: 'Fresh Vegetables' }
            case 'fruits':
                return { emoji: '🍎', bg: 'bg-red-100', text: 'text-red-600', label: 'Fresh Fruits' }
            case 'herbs':
                return { emoji: '🌿', bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Fresh Herbs' }
            case 'dairy':
                return { emoji: '🥛', bg: 'bg-blue-100', text: 'text-blue-600', label: 'Dairy Products' }
            case 'grains':
                return { emoji: '🌾', bg: 'bg-amber-100', text: 'text-amber-600', label: 'Whole Grains' }
            case 'meat':
                return { emoji: '🥩', bg: 'bg-rose-100', text: 'text-rose-600', label: 'Fresh Meat' }
            case 'other':
                return { emoji: '🛒', bg: 'bg-gray-100', text: 'text-gray-600', label: 'Farm Products' }
            default:
                return { emoji: '📦', bg: 'bg-gray-100', text: 'text-gray-600', label: 'Farm Fresh' }
        }
    }

    const placeholder = getPlaceholderContent(category)

    return (
        <div className={`${className} ${placeholder.bg} flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${placeholder.text.replace('text-', 'border-')}`}>
            <div className="text-4xl mb-2">{placeholder.emoji}</div>
            <Package className={`w-6 h-6 ${placeholder.text} opacity-50 mb-1`} />
            <span className={`text-xs ${placeholder.text} font-medium opacity-75`}>
                {placeholder.label}
            </span>
        </div>
    )
}

export default PlaceholderImage