# AI Integration Setup Guide

AgroConnect now includes advanced AI features powered by OpenAI GPT. Follow these steps to enable full AI functionality.

## Features Available

### With AI Enabled (OpenAI API):
- **Intelligent Chatbot**: Natural language conversations with context awareness
- **Farming Advice**: Personalized agricultural guidance for farmers
- **Smart Recommendations**: AI-generated product suggestions with explanations
- **Context-Aware Responses**: Tailored responses based on user role (farmer/consumer)

### Without AI (Fallback Mode):
- **Rule-Based Chatbot**: Keyword-based responses for common queries
- **Basic Recommendations**: Algorithm-based product suggestions
- **Simple Responses**: Pre-defined answers for typical questions

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment
1. Open `backend/.env` file
2. Replace the placeholder with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```
3. Save the file

### 3. Restart the Application
```bash
# Stop the backend server (Ctrl+C)
# Restart it
cd backend
npm start
```

### 4. Verify AI Status
- Open the AI chatbot in the application
- Look for the "AI" badge in the header (green = AI enabled, yellow = basic mode)
- Test with a farming question to see AI-powered responses

## Cost Considerations

- OpenAI charges per token used
- Typical conversation costs are minimal (few cents)
- Monitor usage in OpenAI dashboard
- Set usage limits if needed

## Troubleshooting

### AI Not Working?
1. Check API key is correctly set in `.env`
2. Verify internet connection
3. Check OpenAI account has credits
4. Look at backend console for error messages

### Fallback Mode
If AI fails, the system automatically falls back to rule-based responses, ensuring the application continues to work.

## Security Notes

- Never commit your API key to version control
- Keep your `.env` file secure
- Rotate API keys periodically
- Monitor API usage regularly

## Support

For issues with AI integration, check:
1. Backend console logs
2. OpenAI API status page
3. Your OpenAI account dashboard
4. Network connectivity

The application works perfectly without AI - it's an enhancement, not a requirement!