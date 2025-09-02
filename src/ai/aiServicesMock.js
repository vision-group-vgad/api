// Alternative AI service that uses mock responses for testing
import FinanceService from "../departments/finance/FinanceService.js";
import rvsAnalyticsService from "../departments/administrative/rvsAnalytics/rvsAnalyticsService.js";

// Mock AI responses for testing (simulates what DeepSeek would return)
function mockAIResponse(question) {
  const responses = {
    "server health": {
      intent: "server_health",
      department: "it", 
      filters: {},
      visualization_type: "table",
      confidence: 0.95,
      explanation: "I'll fetch server health metrics from your IT monitoring system"
    },
    "financial": {
      intent: "financial_close_metrics",
      department: "finance",
      filters: {},
      visualization_type: "kpi_card", 
      confidence: 0.92,
      explanation: "I'll analyze your financial performance metrics from the CMS"
    },
    "finance": {
      intent: "reporting_accuracy",
      department: "finance",
      filters: {},
      visualization_type: "table",
      confidence: 0.90,
      explanation: "I'll get your financial reporting accuracy data"
    },
    "revenue": {
      intent: "financial_close_metrics",
      department: "finance",
      filters: { type: "revenue" },
      visualization_type: "line",
      confidence: 0.94,
      explanation: "I'll fetch revenue performance data from your financial systems"
    }
  };
  
  // Find matching response
  const key = Object.keys(responses).find(k => 
    question.toLowerCase().includes(k)
  );
  
  return responses[key] || {
    intent: "unknown",
    department: "general",
    filters: {},
    visualization_type: "table",
    confidence: 0.7,
    explanation: "I'll try to find relevant data for your question"
  };
}

// Main AI function using mock responses
export async function askAIMock(question) {
  const aiResult = mockAIResponse(question);
  
  let data = null;
  
  try {
    // Route to actual services (this uses your real APIs!)
    switch (aiResult.department) {
      case "finance":
        if (aiResult.intent === "financial_close_metrics") {
          // This would call your real finance API
          data = await FinanceService.getFinancialCloseMetrics(aiResult.filters);
        } else if (aiResult.intent === "reporting_accuracy") {
          data = await FinanceService.getReportingAccuracy(aiResult.filters);
        }
        break;
        
      case "administrative":
        if (aiResult.intent === "resource_utilization") {
          data = await rvsAnalyticsService.fetchAllResources(aiResult.filters);
        }
        break;
        
      default:
        // Return mock data for testing
        data = [
          { metric: "Sample Metric", value: 85.2, status: "Good" },
          { metric: "Another Metric", value: 92.1, status: "Excellent" }
        ];
    }
    
  } catch (error) {
    console.log(`Service error: ${error.message}`);
    // Return mock data if service fails
    data = [
      { 
        metric: "Mock Data", 
        value: 75.5, 
        note: `Service ${aiResult.department} not available: ${error.message}` 
      }
    ];
  }
  
  return {
    explanation: aiResult.explanation,
    intent: aiResult.intent,
    department: aiResult.department,
    visualization_type: aiResult.visualization_type,
    confidence: aiResult.confidence,
    data,
    additionalInsights: [
      `Found ${Array.isArray(data) ? data.length : 0} records`,
      "Using mock AI responses (DeepSeek billing needed for full AI)"
    ],
    timestamp: new Date().toISOString(),
    mockMode: true
  };
}
