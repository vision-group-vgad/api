# DeepSeek AI Integration Guide

## 🚀 Overview

This document explains how to set up and use DeepSeek AI for natural language querying and data analytics in the Vision Group API Gateway.

## 🔧 Configuration

### 1. Get DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in to your account
3. Navigate to API section
4. Generate a new API key
5. Copy the API key for configuration

### 2. Environment Configuration

Update your `.env` file with DeepSeek credentials:

```env
# DeepSeek AI Configuration
DEEPSEEK_API_KEY=your-actual-deepseek-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
```

**Available Models:**
- `deepseek-chat` - General purpose conversational AI (recommended)
- `deepseek-coder` - Specialized for code-related queries
- `deepseek-reasoner` - Enhanced reasoning capabilities

### 3. API Endpoint

The AI endpoint is available at:
```
POST /api/v1/ai/query
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What's our revenue performance this quarter?"
}
```

## 📊 Supported Analytics Categories

### Editorial Department
- Content performance analysis
- Readership trends and engagement
- Journalist productivity metrics
- Breaking news traction
- Social sentiment analysis
- Content freshness tracking

### Finance Department  
- Revenue performance analysis
- Budget variance reporting
- Asset depreciation tracking
- Cash flow analysis
- Expense categorization
- ROI analysis and forecasting

### Sales & Marketing
- Campaign performance metrics
- Revenue attribution analysis
- Client lifetime value calculation
- Conversion funnel analysis
- Territory performance tracking
- A/B testing results

### Operations
- Production yield analysis
- Delivery timeline tracking
- Resource utilization metrics
- Equipment efficiency (OEE)
- Material waste analysis
- Route optimization

### IT Department
- Server health monitoring
- Storage utilization analysis
- Cyber security posture
- Patch compliance tracking
- System performance metrics
- Infrastructure cost analysis

### Administrative
- Meeting analytics
- Task completion rates
- Visitor pattern analysis
- Process throughput metrics
- Resource allocation efficiency

### Executive Dashboard
- Company-wide KPIs
- Strategic initiative tracking
- Market share analysis
- Financial health indicators
- Risk management metrics
- Compliance tracking

## 🎯 Example Queries

### Natural Language Questions

**Finance:**
- "What's our revenue growth compared to last quarter?"
- "Show me expense breakdown by department"
- "How are we performing against budget?"

**IT:**
- "What's the current server health status?"
- "Which servers have the highest storage utilization?"
- "Show me patch compliance across all systems"

**Sales:**
- "What's our conversion rate this month?"
- "Which sales territories are performing best?"
- "Show me campaign ROI for digital marketing"

**Editorial:**
- "How many articles were published this week?"
- "What's our content engagement rate?"
- "Show me journalist productivity metrics"

**Operations:**
- "What's our production yield for manufacturing?"
- "Show me delivery performance metrics"
- "Which routes are most efficient?"

## 📈 Response Format

```json
{
  "success": true,
  "explanation": "I'll analyze your server health metrics for the last week",
  "intent": "server_health",
  "department": "it",
  "visualization_type": "table",
  "confidence": 0.95,
  "data": [
    {
      "server_name": "web-server-01",
      "cpu_usage": 75.2,
      "memory_usage": 68.5,
      "disk_usage": 82.1,
      "status": "healthy"
    }
  ],
  "additionalInsights": [
    "cpu_usage: Average 72.50, Range 45-95",
    "memory_usage: Average 65.30, Range 40-85",
    "Total records: 12"
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🔒 Security Features

- **JWT Authentication**: All requests require valid authentication token
- **Role-based Access**: Different user roles see different data
- **Input Validation**: Questions are validated and sanitized
- **Rate Limiting**: Prevents API abuse
- **Confidence Scoring**: Low confidence queries are rejected

## 🧪 Testing

Run the test script to verify integration:

```bash
cd src/ai
node test-deepseek.js
```

## 🚨 Error Handling

### Common Errors

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid DeepSeek API key. Please check your DEEPSEEK_API_KEY configuration."
}
```

**Low Confidence:**
```json
{
  "success": false,
  "message": "I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: 45%)"
}
```

**Rate Limit:**
```json
{
  "success": false,
  "message": "DeepSeek AI API rate limit exceeded. Please try again later."
}
```

## 🔧 Customization

### Adding New Analytics

1. Create service functions for your analytics
2. Add intent handling in `aiServices.js`
3. Update department-specific query handlers
4. Test with natural language queries

### Modifying AI Prompts

Edit the prompt in `callDeepSeekAI()` function to:
- Add new analytics categories
- Modify response format
- Adjust confidence thresholds
- Add domain-specific terminology

## 📚 Best Practices

1. **Specific Questions**: More specific questions yield better results
2. **Context Matters**: Include time ranges and departments when relevant
3. **Iterative Refinement**: Use follow-up questions to drill down
4. **Monitor Usage**: Track API usage and costs
5. **Cache Results**: Consider caching for repeated queries

## 🆘 Troubleshooting

### Issue: AI returns wrong department
**Solution:** Be more specific about the department or use department-specific terminology

### Issue: Low confidence scores
**Solution:** Rephrase questions to be more specific and use business terminology

### Issue: API timeouts
**Solution:** Check network connectivity and DeepSeek service status

### Issue: No data returned
**Solution:** Verify the underlying analytics services are working

## 📞 Support

For issues with DeepSeek integration:
1. Check the logs for detailed error messages
2. Verify API key and configuration
3. Test with simple queries first
4. Review the analytics service documentation

---

**Happy Querying! 🚀**
