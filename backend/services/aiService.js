const OpenAI = require('openai');

class AIService {
    constructor() {
        this.openai = null;
        this.isEnabled = false;
        this.initializeOpenAI();
    }

    initializeOpenAI() {
        try {
            const apiKey = process.env.OPENAI_API_KEY;

            if (apiKey && apiKey !== 'your_openai_api_key_here') {
                this.openai = new OpenAI({
                    apiKey: apiKey
                });
                this.isEnabled = true;
                console.log('OpenAI service initialized successfully');
            } else {
                console.log('OpenAI API key not found, using fallback responses');
                this.isEnabled = false;
            }
        } catch (error) {
            console.error('Failed to initialize OpenAI:', error.message);
            this.isEnabled = false;
        }
    }

    async generateChatResponse(message, userContext = {}) {
        if (!this.isEnabled) {
            return this.getFallbackResponse(message);
        }

        try {
            const systemPrompt = this.buildSystemPrompt(userContext);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 200,
                temperature: 0.7,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error.message);
            return this.getFallbackResponse(message);
        }
    }

    buildSystemPrompt(userContext) {
        const basePrompt = `You are AgroConnect AI Assistant, a helpful chatbot for a farm-to-consumer marketplace platform. 

About AgroConnect:
- Direct connection between farmers and consumers
- Fresh, local produce delivery
- Fair pricing by eliminating intermediaries
- Support for organic and sustainable farming
- Located in India, prices in Indian Rupees (₹)

Your role:
- Help users navigate the platform
- Provide information about products, farmers, and orders
- Assist with agricultural and farming questions
- Be friendly, helpful, and knowledgeable about agriculture
- Keep responses concise and actionable

Guidelines:
- Always be positive and supportive
- Mention specific AgroConnect features when relevant
- Use Indian context and terminology
- Suggest practical next steps
- If you don't know something, direct users to support`;

        if (userContext.role === 'farmer') {
            return basePrompt + `\n\nUser Context: You're talking to a farmer who sells on AgroConnect. Focus on helping them with:
- Product listing and management
- Order fulfillment
- Pricing strategies
- Farming best practices
- Platform features for farmers`;
        } else if (userContext.role === 'consumer') {
            return basePrompt + `\n\nUser Context: You're talking to a consumer who buys from AgroConnect. Focus on helping them with:
- Finding products
- Placing orders
- Understanding delivery
- Product quality and freshness
- Platform features for buyers`;
        }

        return basePrompt + `\n\nUser Context: General user - provide information about both buying and selling on AgroConnect.`;
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Enhanced fallback responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
            return "Namaste! Welcome to AgroConnect. I'm here to help you with fresh produce, farming, and our platform. How can I assist you today?";
        }

        if (lowerMessage.includes('product') || lowerMessage.includes('buy') || lowerMessage.includes('shop') || lowerMessage.includes('vegetable') || lowerMessage.includes('fruit')) {
            return "You can browse fresh products from local farmers in our Products section. We have vegetables, fruits, dairy, and more! All prices are in Indian Rupees (₹) and products are sourced directly from verified farmers.";
        }

        if (lowerMessage.includes('farmer') || lowerMessage.includes('farm') || lowerMessage.includes('sell') || lowerMessage.includes('grow')) {
            return "Farmers can join AgroConnect to sell directly to consumers! Sign up as a farmer to start listing your products, manage orders, and get fair prices without intermediaries.";
        }

        if (lowerMessage.includes('order') || lowerMessage.includes('delivery') || lowerMessage.includes('track')) {
            return "Orders are processed quickly and delivered fresh from local farms. You can track your orders in the Dashboard under 'My Orders'. Delivery usually takes 1-3 days depending on your location.";
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rupee') || lowerMessage.includes('₹')) {
            return "Our platform ensures fair pricing in Indian Rupees (₹) by eliminating intermediaries. Farmers get better prices and consumers save money! Check individual product pages for current pricing.";
        }

        if (lowerMessage.includes('organic') || lowerMessage.includes('quality') || lowerMessage.includes('fresh')) {
            return "We prioritize quality and freshness! Many of our farmers offer organic produce with proper certifications. Look for the 'Organic' badge on product listings.";
        }

        if (lowerMessage.includes('location') || lowerMessage.includes('nearby') || lowerMessage.includes('local')) {
            return "Find farmers and products near you using our location features! We connect you with local farmers to ensure the freshest produce and support your community.";
        }

        if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('checkout')) {
            return "We support secure payment methods including cards and digital wallets. All transactions are in Indian Rupees (₹) and processed securely through our platform.";
        }

        return "I'm here to help with AgroConnect! You can ask me about products, farmers, orders, pricing, or how our platform works. For complex queries, please contact our support team.";
    }

    async generateProductRecommendations(userHistory, preferences = {}) {
        if (!this.isEnabled) {
            return "Based on your purchase history, I recommend exploring our seasonal vegetables and organic produce sections.";
        }

        try {
            const prompt = `Based on this user's purchase history: ${JSON.stringify(userHistory)}, 
            suggest 3-4 specific product recommendations for an Indian farm marketplace. 
            Consider seasonal availability, nutritional value, and complementary products. 
            Keep it concise and mention why each product is recommended.`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
                temperature: 0.6,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('Recommendation generation error:', error.message);
            return this.getFallbackResponse("recommendations");
        }
    }

    async analyzeFarmingQuery(query, farmerContext = {}) {
        if (!this.isEnabled) {
            return "For farming advice, I recommend consulting with agricultural experts or checking with your local agricultural extension office.";
        }

        try {
            const prompt = `As an agricultural advisor for Indian farmers, provide practical advice for: "${query}". 
            Consider Indian climate, soil conditions, and farming practices. 
            Keep advice practical and actionable. Limit to 150 words.`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
                temperature: 0.5,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('Farming query analysis error:', error.message);
            return "For detailed farming advice, please consult with agricultural experts or contact our farmer support team.";
        }
    }
}

module.exports = new AIService();