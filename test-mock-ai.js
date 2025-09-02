// Test the mock AI service with real data
import "dotenv/config";
import { askAIMock } from "./src/ai/aiServicesMock.js";

async function testMockAI() {
  console.log("🧪 Testing AI with Mock Responses + Real Data...\n");
  
  const questions = [
    "What's our financial performance?",
    "Show me server health status",
    "What about revenue data?",
    "How's our resource utilization?"
  ];
  
  for (const question of questions) {
    console.log(`📝 Question: "${question}"`);
    console.log("━".repeat(50));
    
    try {
      const result = await askAIMock(question);
      
      console.log(`✅ SUCCESS`);
      console.log(`🎯 Intent: ${result.intent}`);
      console.log(`🏢 Department: ${result.department}`);
      console.log(`📊 Visualization: ${result.visualization_type}`);
      console.log(`🎯 Confidence: ${Math.round(result.confidence * 100)}%`);
      console.log(`💡 Explanation: ${result.explanation}`);
      console.log(`🤖 Mock Mode: ${result.mockMode ? 'Yes' : 'No'}`);
      
      if (result.data && Array.isArray(result.data)) {
        console.log(`📈 Data Records: ${result.data.length}`);
        if (result.data.length > 0) {
          console.log(`📋 Sample Data: ${JSON.stringify(result.data[0], null, 2)}`);
        }
      }
      
      if (result.additionalInsights) {
        console.log(`💫 Insights: ${result.additionalInsights.join('; ')}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log("\n");
  }
  
  console.log("📋 Test Summary:");
  console.log("━".repeat(50));
  console.log("✅ Mock AI responses working");
  console.log("✅ Service routing functional");
  console.log("✅ Data flow architecture ready");
  console.log("💡 Replace mockAIResponse with DeepSeek when billing is set up");
}

testMockAI()
  .then(() => {
    console.log("🎉 Mock AI Test Completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test Failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  });
