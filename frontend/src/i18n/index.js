import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            home: "Home",
            products: "Products",
            farmers: "Farmers",
            cart: "Cart",
            login: "Login",
            register: "Register",
            dashboard: "Dashboard",
            logout: "Logout",

            // Home Page
            heroTitle: "AgroConnect: Bridging Farms & Consumers",
            heroSubtitle: "Revolutionary digital trading platform ensuring fair pricing and eliminating intermediaries between farmers and consumers",
            shopNow: "Shop Now",
            joinAsFarmer: "Join as Farmer",
            scanQR: "Scan QR Code",
            offlineMode: "Offline Mode Active",

            // Features
            whyChoose: "Why Choose AgroConnect?",
            directFromFarm: "Direct from Farm",
            directFromFarmDesc: "Fresh produce delivered straight from local farmers to your doorstep",
            fairPricing: "Fair Pricing",
            fairPricingDesc: "Eliminating intermediaries to ensure farmers receive fair compensation and consumers get better prices",
            communityDriven: "Community Driven",
            communityDrivenDesc: "Supporting local farming communities and sustainable agriculture",
            qualityAssured: "Quality Assured",
            qualityAssuredDesc: "Premium quality products with ratings and reviews from real customers",

            // Products
            freshProducts: "Fresh Products",
            searchProducts: "Search products...",
            allCategories: "All Categories",
            vegetables: "Vegetables",
            fruits: "Fruits",
            dairy: "Dairy",
            grains: "Grains",
            minPrice: "Min ₹",
            maxPrice: "Max ₹",
            sortBy: "Sort by",
            newest: "Newest",
            oldest: "Oldest",
            priceLowHigh: "Price: Low to High",
            priceHighLow: "Price: High to Low",
            rating: "Rating",
            organic: "Organic",
            available: "available",

            // Voice Chat
            voiceChat: "Voice Chat",
            startListening: "Start Listening",
            stopListening: "Stop Listening",
            listening: "Listening...",
            speak: "Speak",
            voiceNotSupported: "Voice recognition not supported in this browser",
            speakYourMessage: "Speak your message in",

            // Common
            loading: "Loading...",
            error: "Error",
            success: "Success",
            cancel: "Cancel",
            save: "Save",
            edit: "Edit",
            delete: "Delete",
            add: "Add",
            remove: "Remove",
            close: "Close",
            back: "Back",
            next: "Next",
            previous: "Previous",

            // Weather
            weather: "Weather",
            smartWeather: "Smart Weather",
            temperature: "Temperature",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            precipitation: "Precipitation",
            forecast: "Forecast",
            alerts: "Alerts",
            recommendations: "Recommendations",

            // Market Intelligence
            marketIntelligence: "Market Intelligence",
            priceAlerts: "Price Alerts",
            cropPlanning: "Crop Planning",
            marketTrends: "Market Trends",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    },
    hi: {
        translation: {
            // Navigation
            home: "होम",
            products: "उत्पाद",
            farmers: "किसान",
            cart: "कार्ट",
            login: "लॉगिन",
            register: "रजिस्टर",
            dashboard: "डैशबोर्ड",
            logout: "लॉगआउट",

            // Home Page
            heroTitle: "एग्रोकनेक्ट: खेत और उपभोक्ताओं को जोड़ना",
            heroSubtitle: "क्रांतिकारी डिजिटल ट्रेडिंग प्लेटफॉर्म जो किसानों और उपभोक्ताओं के बीच निष्पक्ष मूल्य निर्धारण सुनिश्चित करता है",
            shopNow: "अभी खरीदें",
            joinAsFarmer: "किसान के रूप में जुड़ें",
            scanQR: "QR कोड स्कैन करें",
            offlineMode: "ऑफलाइन मोड सक्रिय",

            // Features
            whyChoose: "एग्रोकनेक्ट क्यों चुनें?",
            directFromFarm: "सीधे खेत से",
            directFromFarmDesc: "स्थानीय किसानों से सीधे आपके दरवाजे तक ताजा उत्पाद",
            fairPricing: "निष्पक्ष मूल्य निर्धारण",
            fairPricingDesc: "बिचौलियों को हटाकर किसानों को उचित मुआवजा और उपभोक्ताओं को बेहतर कीमत सुनिश्चित करना",
            communityDriven: "समुदाय संचालित",
            communityDrivenDesc: "स्थानीय कृषि समुदायों और टिकाऊ कृषि का समर्थन",
            qualityAssured: "गुणवत्ता आश्वासन",
            qualityAssuredDesc: "वास्तविक ग्राहकों की रेटिंग और समीक्षा के साथ प्रीमियम गुणवत्ता उत्पाद",

            // Products
            freshProducts: "ताजा उत्पाद",
            searchProducts: "उत्पाद खोजें...",
            allCategories: "सभी श्रेणियां",
            vegetables: "सब्जियां",
            fruits: "फल",
            dairy: "डेयरी",
            grains: "अनाज",
            minPrice: "न्यूनतम ₹",
            maxPrice: "अधिकतम ₹",
            sortBy: "इसके अनुसार क्रमबद्ध करें",
            newest: "नवीनतम",
            oldest: "पुराना",
            priceLowHigh: "कीमत: कम से ज्यादा",
            priceHighLow: "कीमत: ज्यादा से कम",
            rating: "रेटिंग",
            organic: "जैविक",
            available: "उपलब्ध",

            // Voice Chat
            voiceChat: "आवाज चैट",
            startListening: "सुनना शुरू करें",
            stopListening: "सुनना बंद करें",
            listening: "सुन रहे हैं...",
            speak: "बोलें",
            voiceNotSupported: "इस ब्राउज़र में आवाज पहचान समर्थित नहीं है",
            speakYourMessage: "अपना संदेश बोलें",

            // Common
            loading: "लोड हो रहा है...",
            error: "त्रुटि",
            success: "सफलता",
            cancel: "रद्द करें",
            save: "सेव करें",
            edit: "संपादित करें",
            delete: "हटाएं",
            add: "जोड़ें",
            remove: "हटाएं",
            close: "बंद करें",
            back: "वापस",
            next: "अगला",
            previous: "पिछला",

            // Weather
            weather: "मौसम",
            smartWeather: "स्मार्ट मौसम",
            temperature: "तापमान",
            humidity: "आर्द्रता",
            windSpeed: "हवा की गति",
            precipitation: "वर्षा",
            forecast: "पूर्वानुमान",
            alerts: "अलर्ट",
            recommendations: "सिफारिशें",

            // Market Intelligence
            marketIntelligence: "बाजार बुद्धिमत्ता",
            priceAlerts: "मूल्य अलर्ट",
            cropPlanning: "फसल योजना",
            marketTrends: "बाजार के रुझान",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    },
    ta: {
        translation: {
            // Navigation
            home: "முகப்பு",
            products: "பொருட்கள்",
            farmers: "விவசாயிகள்",
            cart: "கார்ட்",
            login: "உள்நுழைவு",
            register: "பதிவு",
            dashboard: "டாஷ்போர்டு",
            logout: "வெளியேறு",

            // Home Page
            heroTitle: "அக்ரோகனெக்ட்: பண்ணைகள் மற்றும் நுகர்வோரை இணைக்கிறது",
            heroSubtitle: "விவசாயிகள் மற்றும் நுகர்வோர் இடையே நியாயமான விலை நிர்ணயம் மற்றும் இடைத்தரகர்களை நீக்குவதை உறுதி செய்யும் புரட்சிகர டிஜிட்டல் வர்த்தக தளம்",
            shopNow: "இப்போது வாங்கவும்",
            joinAsFarmer: "விவசாயியாக சேரவும்",
            scanQR: "QR குறியீட்டை ஸ்கேன் செய்யவும்",
            offlineMode: "ஆஃப்லைன் பயன்முறை செயலில்",

            // Features
            whyChoose: "அக்ரோகனெக்ட் ஏன் தேர்வு செய்ய வேண்டும்?",
            directFromFarm: "நேரடியாக பண்ணையிலிருந்து",
            directFromFarmDesc: "உள்ளூர் விவசாயிகளிடமிருந்து நேரடியாக உங்கள் வீட்டு வாசலுக்கு புதிய பொருட்கள்",
            fairPricing: "நியாயமான விலை நிர்ணயம்",
            fairPricingDesc: "இடைத்தரகர்களை நீக்கி விவசாயிகளுக்கு நியாயமான இழப்பீடு மற்றும் நுகர்வோருக்கு சிறந்த விலையை உறுதி செய்தல்",
            communityDriven: "சமூக உந்துதல்",
            communityDrivenDesc: "உள்ளூர் விவசாய சமூகங்கள் மற்றும் நிலையான விவசாயத்தை ஆதரித்தல்",
            qualityAssured: "தர உத்தரவாதம்",
            qualityAssuredDesc: "உண்மையான வாடிக்கையாளர்களின் மதிப்பீடுகள் மற்றும் மதிப்புரைகளுடன் பிரீமியம் தர பொருட்கள்",

            // Products
            freshProducts: "புதிய பொருட்கள்",
            searchProducts: "பொருட்களைத் தேடவும்...",
            allCategories: "அனைத்து வகைகள்",
            vegetables: "காய்கறிகள்",
            fruits: "பழங்கள்",
            dairy: "பால் பொருட்கள்",
            grains: "தானியங்கள்",
            minPrice: "குறைந்தபட்சம் ₹",
            maxPrice: "அதிகபட்சம் ₹",
            sortBy: "இதன் அடிப்படையில் வரிசைப்படுத்து",
            newest: "புதியது",
            oldest: "பழையது",
            priceLowHigh: "விலை: குறைவு முதல் அதிகம்",
            priceHighLow: "விலை: அதிகம் முதல் குறைவு",
            rating: "மதிப்பீடு",
            organic: "இயற்கை",
            available: "கிடைக்கிறது",

            // Voice Chat
            voiceChat: "குரல் அரட்டை",
            startListening: "கேட்க ஆரம்பிக்கவும்",
            stopListening: "கேட்பதை நிறுத்தவும்",
            listening: "கேட்கிறது...",
            speak: "பேசவும்",
            voiceNotSupported: "இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை",
            speakYourMessage: "உங்கள் செய்தியைப் பேசவும்",

            // Common
            loading: "ஏற்றுகிறது...",
            error: "பிழை",
            success: "வெற்றி",
            cancel: "ரத்து செய்",
            save: "சேமி",
            edit: "திருத்து",
            delete: "நீக்கு",
            add: "சேர்",
            remove: "அகற்று",
            close: "மூடு",
            back: "பின்",
            next: "அடுத்து",
            previous: "முந்தைய",

            // Weather
            weather: "வானிலை",
            smartWeather: "ஸ்மார்ட் வானிலை",
            temperature: "வெப்பநிலை",
            humidity: "ஈரப்பதம்",
            windSpeed: "காற்றின் வேகம்",
            precipitation: "மழைப்பொழிவு",
            forecast: "முன்னறிவிப்பு",
            alerts: "எச்சரிக்கைகள்",
            recommendations: "பரிந்துரைகள்",

            // Market Intelligence
            marketIntelligence: "சந்தை நுண்ணறிவு",
            priceAlerts: "விலை எச்சரிக்கைகள்",
            cropPlanning: "பயிர் திட்டமிடல்",
            marketTrends: "சந்தை போக்குகள்",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    },
    te: {
        translation: {
            // Navigation
            home: "హోమ్",
            products: "ఉత్పత్తులు",
            farmers: "రైతులు",
            cart: "కార్ట్",
            login: "లాగిన్",
            register: "రిజిస్టర్",
            dashboard: "డాష్‌బోర్డ్",
            logout: "లాగ్అవుట్",

            // Home Page
            heroTitle: "అగ్రోకనెక్ట్: వ్యవసాయ క్షేత్రాలు మరియు వినియోగదారులను కలుపుతోంది",
            heroSubtitle: "రైతులు మరియు వినియోగదారుల మధ్య న్యాయమైన ధర నిర్ణయం మరియు మధ్యవర్తులను తొలగించడాన్ని నిర్ధారించే విప్లవాత్మక డిజిటల్ వ్యాపార వేదిక",
            shopNow: "ఇప్పుడే కొనుగోలు చేయండి",
            joinAsFarmer: "రైతుగా చేరండి",
            scanQR: "QR కోడ్‌ను స్కాన్ చేయండి",
            offlineMode: "ఆఫ్‌లైన్ మోడ్ సక్రియం",

            // Features
            whyChoose: "అగ్రోకనెక్ట్‌ను ఎందుకు ఎంచుకోవాలి?",
            directFromFarm: "నేరుగా వ్యవసాయ క్షేత్రం నుండి",
            directFromFarmDesc: "స్థానిక రైతుల నుండి నేరుగా మీ ఇంటి వాకిలికి తాజా ఉత్పత్తులు",
            fairPricing: "న్యాయమైన ధర నిర్ణయం",
            fairPricingDesc: "మధ్యవర్తులను తొలగించి రైతులకు న్యాయమైన పరిహారం మరియు వినియోగదారులకు మెరుగైన ధరలను నిర్ధారించడం",
            communityDriven: "సమాజ ఆధారిత",
            communityDrivenDesc: "స్థానిక వ్యవసాయ సమాజాలు మరియు స్థిరమైన వ్యవసాయానికి మద్దతు",
            qualityAssured: "నాణ్యత హామీ",
            qualityAssuredDesc: "నిజమైన కస్టమర్ల రేటింగ్‌లు మరియు సమీక్షలతో ప్రీమియం నాణ్యత ఉత్పత్తులు",

            // Products
            freshProducts: "తాజా ఉత్పత్తులు",
            searchProducts: "ఉత్పత్తులను వెతకండి...",
            allCategories: "అన్ని వర్గాలు",
            vegetables: "కూరగాయలు",
            fruits: "పండ్లు",
            dairy: "పాల ఉత్పత్తులు",
            grains: "ధాన్యాలు",
            minPrice: "కనిష్ట ₹",
            maxPrice: "గరిష్ట ₹",
            sortBy: "దీని ఆధారంగా క్రమబద్ధీకరించండి",
            newest: "కొత్తది",
            oldest: "పాతది",
            priceLowHigh: "ధర: తక్కువ నుండి ఎక్కువ",
            priceHighLow: "ధర: ఎక్కువ నుండి తక్కువ",
            rating: "రేటింగ్",
            organic: "సేంద్రీయ",
            available: "అందుబాటులో",

            // Voice Chat
            voiceChat: "వాయిస్ చాట్",
            startListening: "వినడం ప్రారంభించండి",
            stopListening: "వినడం ఆపండి",
            listening: "వింటోంది...",
            speak: "మాట్లాడండి",
            voiceNotSupported: "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు మద్దతు లేదు",
            speakYourMessage: "మీ సందేశాన్ని చెప్పండి",

            // Common
            loading: "లోడ్ అవుతోంది...",
            error: "లోపం",
            success: "విజయం",
            cancel: "రద్దు చేయండి",
            save: "సేవ్ చేయండి",
            edit: "సవరించండి",
            delete: "తొలగించండి",
            add: "జోడించండి",
            remove: "తొలగించండి",
            close: "మూసివేయండి",
            back: "వెనుకకు",
            next: "తదుపరి",
            previous: "మునుపటి",

            // Weather
            weather: "వాతావరణం",
            smartWeather: "స్మార్ట్ వాతావరణం",
            temperature: "ఉష్ణోగ్రత",
            humidity: "తేమ",
            windSpeed: "గాలి వేగం",
            precipitation: "వర్షపాతం",
            forecast: "అంచనా",
            alerts: "హెచ్చరికలు",
            recommendations: "సిఫార్సులు",

            // Market Intelligence
            marketIntelligence: "మార్కెట్ ఇంటెలిజెన్స్",
            priceAlerts: "ధర హెచ్చరికలు",
            cropPlanning: "పంట ప్రణాళిక",
            marketTrends: "మార్కెట్ ట్రెండ్స్",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    },
    bn: {
        translation: {
            // Navigation
            home: "হোম",
            products: "পণ্য",
            farmers: "কৃষক",
            cart: "কার্ট",
            login: "লগইন",
            register: "নিবন্ধন",
            dashboard: "ড্যাশবোর্ড",
            logout: "লগআউট",

            // Home Page
            heroTitle: "অ্যাগ্রোকানেক্ট: খামার এবং ভোক্তাদের সংযোগ",
            heroSubtitle: "কৃষক এবং ভোক্তাদের মধ্যে ন্যায্য মূল্য নির্ধারণ এবং মধ্যস্থতাকারীদের নির্মূল নিশ্চিত করে বিপ্লবী ডিজিটাল ট্রেডিং প্ল্যাটফর্ম",
            shopNow: "এখনই কিনুন",
            joinAsFarmer: "কৃষক হিসেবে যোগ দিন",
            scanQR: "QR কোড স্ক্যান করুন",
            offlineMode: "অফলাইন মোড সক্রিয়",

            // Features
            whyChoose: "কেন অ্যাগ্রোকানেক্ট বেছে নেবেন?",
            directFromFarm: "সরাসরি খামার থেকে",
            directFromFarmDesc: "স্থানীয় কৃষকদের থেকে সরাসরি আপনার দোরগোড়ায় তাজা পণ্য",
            fairPricing: "ন্যায্য মূল্য নির্ধারণ",
            fairPricingDesc: "মধ্যস্থতাকারীদের নির্মূল করে কৃষকদের ন্যায্য ক্ষতিপূরণ এবং ভোক্তাদের ভাল দাম নিশ্চিত করা",
            communityDriven: "সম্প্রদায় চালিত",
            communityDrivenDesc: "স্থানীয় কৃষি সম্প্রদায় এবং টেকসই কৃষিকে সমর্থন",
            qualityAssured: "মান নিশ্চিত",
            qualityAssuredDesc: "প্রকৃত গ্রাহকদের রেটিং এবং পর্যালোচনা সহ প্রিমিয়াম মানের পণ্য",

            // Products
            freshProducts: "তাজা পণ্য",
            searchProducts: "পণ্য খুঁজুন...",
            allCategories: "সব বিভাগ",
            vegetables: "সবজি",
            fruits: "ফল",
            dairy: "দুগ্ধজাত",
            grains: "শস্য",
            minPrice: "সর্বনিম্ন ₹",
            maxPrice: "সর্বোচ্চ ₹",
            sortBy: "এর ভিত্তিতে সাজান",
            newest: "নতুন",
            oldest: "পুরাতন",
            priceLowHigh: "দাম: কম থেকে বেশি",
            priceHighLow: "দাম: বেশি থেকে কম",
            rating: "রেটিং",
            organic: "জৈব",
            available: "উপলব্ধ",

            // Voice Chat
            voiceChat: "ভয়েস চ্যাট",
            startListening: "শোনা শুরু করুন",
            stopListening: "শোনা বন্ধ করুন",
            listening: "শুনছে...",
            speak: "বলুন",
            voiceNotSupported: "এই ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়",
            speakYourMessage: "আপনার বার্তা বলুন",

            // Common
            loading: "লোড হচ্ছে...",
            error: "ত্রুটি",
            success: "সফলতা",
            cancel: "বাতিল",
            save: "সংরক্ষণ",
            edit: "সম্পাদনা",
            delete: "মুছুন",
            add: "যোগ করুন",
            remove: "সরান",
            close: "বন্ধ",
            back: "পিছনে",
            next: "পরবর্তী",
            previous: "পূর্ববর্তী",

            // Weather
            weather: "আবহাওয়া",
            smartWeather: "স্মার্ট আবহাওয়া",
            temperature: "তাপমাত্রা",
            humidity: "আর্দ্রতা",
            windSpeed: "বাতাসের গতি",
            precipitation: "বৃষ্টিপাত",
            forecast: "পূর্বাভাস",
            alerts: "সতর্কতা",
            recommendations: "সুপারিশ",

            // Market Intelligence
            marketIntelligence: "বাজার বুদ্ধিমত্তা",
            priceAlerts: "দাম সতর্কতা",
            cropPlanning: "ফসল পরিকল্পনা",
            marketTrends: "বাজার প্রবণতা",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    },
    mr: {
        translation: {
            // Navigation
            home: "होम",
            products: "उत्पादने",
            farmers: "शेतकरी",
            cart: "कार्ट",
            login: "लॉगिन",
            register: "नोंदणी",
            dashboard: "डॅशबोर्ड",
            logout: "लॉगआउट",

            // Home Page
            heroTitle: "अॅग्रोकनेक्ट: शेत आणि ग्राहकांना जोडणे",
            heroSubtitle: "शेतकरी आणि ग्राहकांमध्ये न्याय्य किंमत निर्धारण आणि मध्यस्थांना काढून टाकण्याची खात्री देणारे क्रांतिकारी डिजिटल ट्रेडिंग प्लॅटफॉर्म",
            shopNow: "आता खरेदी करा",
            joinAsFarmer: "शेतकरी म्हणून सामील व्हा",
            scanQR: "QR कोड स्कॅन करा",
            offlineMode: "ऑफलाइन मोड सक्रिय",

            // Features
            whyChoose: "अॅग्रोकनेक्ट का निवडावे?",
            directFromFarm: "थेट शेतातून",
            directFromFarmDesc: "स्थानिक शेतकऱ्यांकडून थेट तुमच्या दारापर्यंत ताजी उत्पादने",
            fairPricing: "न्याय्य किंमत निर्धारण",
            fairPricingDesc: "मध्यस्थ काढून टाकून शेतकऱ्यांना न्याय्य नुकसान भरपाई आणि ग्राहकांना चांगली किंमत सुनिश्चित करणे",
            communityDriven: "समुदाय चालित",
            communityDrivenDesc: "स्थानिक शेती समुदाय आणि टिकाऊ शेतीला पाठिंबा",
            qualityAssured: "गुणवत्ता हमी",
            qualityAssuredDesc: "खऱ्या ग्राहकांच्या रेटिंग आणि पुनरावलोकनांसह प्रीमियम गुणवत्तेची उत्पादने",

            // Products
            freshProducts: "ताजी उत्पादने",
            searchProducts: "उत्पादने शोधा...",
            allCategories: "सर्व श्रेणी",
            vegetables: "भाज्या",
            fruits: "फळे",
            dairy: "दुग्धजन्य पदार्थ",
            grains: "धान्य",
            minPrice: "किमान ₹",
            maxPrice: "कमाल ₹",
            sortBy: "यानुसार क्रमवारी लावा",
            newest: "नवीन",
            oldest: "जुने",
            priceLowHigh: "किंमत: कमी ते जास्त",
            priceHighLow: "किंमत: जास्त ते कमी",
            rating: "रेटिंग",
            organic: "सेंद्रिय",
            available: "उपलब्ध",

            // Voice Chat
            voiceChat: "व्हॉइस चॅट",
            startListening: "ऐकणे सुरू करा",
            stopListening: "ऐकणे थांबवा",
            listening: "ऐकत आहे...",
            speak: "बोला",
            voiceNotSupported: "या ब्राउझरमध्ये व्हॉइस रिकग्निशन समर्थित नाही",
            speakYourMessage: "तुमचा संदेश बोला",

            // Common
            loading: "लोड होत आहे...",
            error: "त्रुटी",
            success: "यश",
            cancel: "रद्द करा",
            save: "जतन करा",
            edit: "संपादित करा",
            delete: "हटवा",
            add: "जोडा",
            remove: "काढा",
            close: "बंद करा",
            back: "मागे",
            next: "पुढे",
            previous: "मागील",

            // Weather
            weather: "हवामान",
            smartWeather: "स्मार्ट हवामान",
            temperature: "तापमान",
            humidity: "आर्द्रता",
            windSpeed: "वाऱ्याचा वेग",
            precipitation: "पर्जन्यमान",
            forecast: "अंदाज",
            alerts: "सूचना",
            recommendations: "शिफारसी",

            // Market Intelligence
            marketIntelligence: "बाजार बुद्धिमत्ता",
            priceAlerts: "किंमत सूचना",
            cropPlanning: "पीक नियोजन",
            marketTrends: "बाजार ट्रेंड",

            // Language Names
            english: "English",
            hindi: "हिंदी",
            tamil: "தமிழ்",
            telugu: "తెలుగు",
            bengali: "বাংলা",
            marathi: "मराठी"
        }
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,

        interpolation: {
            escapeValue: false
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        }
    })

export default i18n