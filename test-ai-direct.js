// Direct test of AI functionality without HTTP
import "dotenv/config";
import { askAI } from "./src/ai/aiServices.js";

async function testAIDirect() {
  console.log("🧪 Testing DeepSeek AI Integration Directly...\n");
  
  const testQuestions = [
    "What's our server health status?",
    "Show me financial performance metrics",
    "What is our storage utilization?"
  ];

  for (const question of testQuestions) {
    console.log(`📝 Testing: "${question}"`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    try {
      const startTime = Date.now();
      const result = await askAI(question);
      const endTime = Date.now();
      
      console.log(`✅ SUCCESS (${endTime - startTime}ms)`);
      console.log(`🎯 Intent: ${result.intent}`);
      console.log(`🏢 Department: ${result.department}`);
      console.log(`📊 Visualization: ${result.visualization_type}`);
      console.log(`🎯 Confidence: ${Math.round((result.confidence || 0) * 100)}%`);
      console.log(`💡 Explanation: ${result.explanation}`);
      
      if (result.data) {
        console.log(`📈 Data Records: ${Array.isArray(result.data) ? result.data.length : 'N/A'}`);
        if (Array.isArray(result.data) && result.data.length > 0) {
          console.log(`📋 Sample Data Keys: ${Object.keys(result.data[0]).join(', ')}`);
        }
      }
      
      if (result.additionalInsights && result.additionalInsights.length > 0) {
        console.log(`💫 Insights: ${result.additionalInsights.slice(0, 2).join('; ')}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      
      // Check if it's a configuration issue
      if (error.message.includes('DeepSeek API key')) {
        console.log(`🔧 Fix: Add your DeepSeek API key to .env file`);
      } else if (error.message.includes('not yet implemented')) {
        console.log(`🚧 Note: This analytics service is not yet connected`);
      } else if (error.message.includes('Unknown intent')) {
        console.log(`🤔 Note: AI understood the question but no matching service found`);
      }
    }
    
    console.log("\n");
  }
}

// Environment check
console.log("🔧 Environment Check:");
console.log(`📍 DeepSeek API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`📍 DeepSeek Model: ${process.env.DEEPSEEK_MODEL || 'deepseek-chat'}`);
console.log(`📍 Database URL: ${process.env.DATABASE_URL ? '✅ Present' : '❌ Missing'}`);
console.log(`📍 CMS API: ${process.env.CMC_API_BASE_URL || '❌ Missing'}`);
console.log("");

// Run test
testAIDirect()
  .then(() => {
    console.log("🎉 AI Direct Test Completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test Failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  });
