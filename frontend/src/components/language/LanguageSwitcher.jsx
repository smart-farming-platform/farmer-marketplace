import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
        { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
    ]

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode)
        setIsOpen(false)

        // Store language preference
        localStorage.setItem('preferred-language', langCode)

        // Update document direction for RTL languages if needed
        document.documentElement.dir = ['ar', 'ur'].includes(langCode) ? 'rtl' : 'ltr'
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                    {currentLanguage.flag} {currentLanguage.nativeName}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => changeLanguage(language.code)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 ${i18n.language === language.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                    }`}
                            >
                                <span className="text-lg">{language.flag}</span>
                                <div>
                                    <div className="font-medium">{language.nativeName}</div>
                                    <div className="text-xs text-gray-500">{language.name}</div>
                                </div>
                                {i18n.language === language.code && (
                                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    )
}

export default LanguageSwitcher