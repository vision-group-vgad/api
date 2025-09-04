// Test script for DeepSeek AI integration
import "dotenv/config";
import { askAI } from "./aiServices.js";

async function testDeepSeekIntegration() {
  console.log("🧪 Testing DeepSeek AI Integration...\n");
  
  const testQuestions = [
    "What's our server health status?",
    "Show me financial performance metrics",
    "How are our editorial teams performing?",
    "What's the storage utilization across servers?",
    "Give me sales analytics for this quarter"
  ];

  for (const question of testQuestions) {
    console.log(`📝 Question: "${question}"`);
    
    try {
      const result = await askAI(question);
      console.log(`✅ Intent: ${result.intent}`);
      console.log(`🏢 Department: ${result.department}`);
      console.log(`📊 Visualization: ${result.visualization_type}`);
      console.log(`🎯 Confidence: ${Math.round(result.confidence * 100)}%`);
      console.log(`💡 Explanation: ${result.explanation}`);
      console.log("---\n");
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log("---\n");
    }
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDeepSeekIntegration()
    .then(() => {
      console.log("🎉 DeepSeek integration test completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test failed:", error.message);
      process.exit(1);
    });
}

export { testDeepSeekIntegration };
