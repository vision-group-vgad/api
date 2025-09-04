import axios from "axios";

// --- Import all analytics services (use correct filenames/paths) ---
import rvsAnalyticsService from "../departments/administrative/rvsAnalytics/rvsAnalyticsService.js";
import OperationsProductionAnalyticsService from "../departments/operations/OperationsProductionAnalytics/OperationsProductionAnalyticsService.js";
import SupervisorSalesAnalyticsService from "../departments/sales/SupervisorSalesAnalytics/SupervisorSalesAnalyticsService.js";
import FinanceService from "../departments/finance/FinanceService.js";
import ServerStoragePatchService from "../departments/it/ServerStoragePatchAnalytics/ServerStoragePatchService.js";
import { checkDepartmentAccess, filterDataByAccess, logAccess } from "./accessControl.js";
// Add more as needed, e.g.:
// import EditorialService from "../departments/editorial/EditorialService.js";
// import HRService from "../departments/hr/HRService.js";

// --- DeepSeek AI API Setup ---
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

// --- Helper: Call DeepSeek AI to interpret the question ---
async function callDeepSeekAI(question) {
  const prompt = `
You are an advanced analytics assistant for Vision Group, a comprehensive media and business company.
You have access to analytics across multiple departments: sales, finance, editorial, operations, IT, administration, and executive dashboards.

Your task is to interpret natural language questions and return actionable analytics queries.

Available analytics categories:
- EDITORIAL: Content performance, readership trends, journalist productivity, breaking news traction, social sentiment
- FINANCE: Revenue analysis, budget variance, asset depreciation, cash flow, expense tracking, ROI analysis
- SALES: Campaign performance, revenue attribution, client lifetime value, conversion funnels, territory performance
- OPERATIONS: Production yield, delivery timelines, resource utilization, equipment efficiency
- IT: Server health, storage utilization, cyber security posture, patch compliance, system performance
- ADMINISTRATIVE: Meeting analytics, task completion rates, visitor patterns, process throughput
- EXECUTIVE: Company-wide KPIs, strategic initiatives, market share, financial health, risk management

Given the user's question, return a JSON object with:
- "intent": The specific analytics intent (e.g. "revenue_performance", "content_engagement", "server_health", "editorial_productivity")
- "department": The relevant department ("editorial", "finance", "sales", "operations", "it", "administrative", "executive")
- "filters": Object with any filters like date ranges, specific metrics, departments, etc.
- "visualization_type": Suggested chart type ("line", "bar", "pie", "table", "kpi_card", "heatmap")
- "explanation": Clear explanation of what insights will be provided
- "confidence": Confidence level (0-1) in understanding the query

User question: "${question}"

Return only valid JSON with no additional text.
`;

  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in your environment variables.");
  }

  const maxRetries = 3;
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content: "You are an expert business analytics AI assistant. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1000,
          top_p: 0.9
        },
        {
          headers: {
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const text = response.data.choices[0].message.content.trim();
      
      // Clean the response in case it has markdown formatting
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const result = JSON.parse(cleanText);
        
        // Validate required fields
        if (!result.intent || !result.department || !result.explanation) {
          throw new Error("AI response missing required fields");
        }
        
        return result;
      } catch {
        throw new Error(`DeepSeek AI returned invalid JSON: ${cleanText}`);
      }
    } catch (err) {
      lastError = err;
      attempt++;
      
      if (err.response) {
        const status = err.response.status;
        if (status === 429) {
          // Rate limit hit, wait and retry with exponential backoff
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Rate limit hit, retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
        } else if (status === 401) {
          throw new Error("Invalid DeepSeek API key. Please check your DEEPSEEK_API_KEY configuration.");
        } else if (status >= 500) {
          // Server error, retry
          const delay = attempt * 2000; // 2s, 4s, 6s
          await new Promise(res => setTimeout(res, delay));
        } else {
          throw err;
        }
      } else if (err.code === 'ECONNABORTED') {
        // Timeout, retry
        const delay = attempt * 1500;
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  
  throw new Error(`DeepSeek AI API failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
}

// --- Main AI Service Function ---
export async function askAI(question, user = null) {
  const aiResult = await callDeepSeekAI(question);

  // Validate AI response confidence
  if (aiResult.confidence && aiResult.confidence < 0.6) {
    throw new Error(`I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: ${Math.round(aiResult.confidence * 100)}%)`);
  }

  // Check access control if user is provided
  if (user) {
    const accessResult = checkDepartmentAccess(user, aiResult.department, aiResult.intent);
    
    // Log the access attempt
    const accessLog = logAccess(user, aiResult.department, aiResult.intent, accessResult);
    console.log("🔐 Access Control:", JSON.stringify(accessLog, null, 2));
    
    // Deny access if not allowed
    if (!accessResult.allowed) {
      throw new Error(`Access Denied: ${accessResult.reason}. ${accessResult.suggestion || ''}`);
    }
    
    // Add access level info to response
    aiResult.accessLevel = accessResult.accessLevel;
    aiResult.userLevel = accessResult.userLevel;
  }

  let data = null;
  let additionalInsights = null;

  // Enhanced intent matching with department-based routing
  const { intent, department, filters = {} } = aiResult;

  try {
    switch (department) {
      case "administrative":
        data = await handleAdministrativeQueries(intent, filters);
        break;
      case "operations":
        data = await handleOperationsQueries(intent, filters);
        break;
      case "sales":
        data = await handleSalesQueries(intent, filters);
        break;
      case "finance":
        data = await handleFinanceQueries(intent, filters);
        break;
      case "it":
        data = await handleITQueries(intent, filters);
        break;
      case "editorial":
        data = await handleEditorialQueries(intent);
        break;
      case "executive":
        data = await handleExecutiveQueries(intent);
        break;
      default:
        // Fallback to legacy intent matching
        data = await handleLegacyIntents(intent, filters);
    }

    // Apply data filtering based on user access level
    if (user && data) {
      const accessResult = checkDepartmentAccess(user, department, intent);
      data = filterDataByAccess(data, accessResult, user);
      
      // Add access info to insights
      additionalInsights = additionalInsights || [];
      additionalInsights.push(`Access Level: ${accessResult.accessLevel || 'standard'}`);
      
      if (accessResult.accessLevel === "limited") {
        additionalInsights.push("Some data fields may be filtered based on your access permissions");
      }
    }

    // Generate additional insights based on the data
    if (data && Array.isArray(data) && data.length > 0) {
      const dataInsights = generateDataInsights(data);
      additionalInsights = additionalInsights ? [...additionalInsights, ...dataInsights] : dataInsights;
    }

  } catch (error) {
    throw new Error(`Failed to fetch ${department} analytics for "${intent}": ${error.message}`);
  }

  return {
    explanation: aiResult.explanation,
    intent: aiResult.intent,
    department: aiResult.department,
    visualization_type: aiResult.visualization_type || "table",
    confidence: aiResult.confidence || 1.0,
    accessLevel: aiResult.accessLevel,
    userLevel: aiResult.userLevel,
    data,
    additionalInsights,
    timestamp: new Date().toISOString(),
    user: user ? {
      department: user.department,
      position: user.position,
      name: `${user.firstName} ${user.lastName}`
    } : null
  };
}

// Department-specific query handlers
async function handleAdministrativeQueries(intent, filters) {
  switch (intent) {
    case "vendor_early_deliveries":
    case "vendor_performance":
      return await rvsAnalyticsService.fetchAllVendors({ ...filters, delay_days: 0 });
    case "resource_utilization":
      return await rvsAnalyticsService.fetchAllResources(filters);
    case "space_optimization":
      return await rvsAnalyticsService.fetchAllSpaces(filters);
    default:
      throw new Error(`Unknown administrative intent: ${intent}`);
  }
}

async function handleOperationsQueries(intent, filters) {
  switch (intent) {
    case "production_yield":
      return await OperationsProductionAnalyticsService.fetchProductionYield(filters);
    case "machine_oee":
    case "equipment_efficiency":
      return await OperationsProductionAnalyticsService.fetchMachineOEE(filters);
    case "material_waste":
      return await OperationsProductionAnalyticsService.fetchMaterialWaste(filters);
    default:
      throw new Error(`Unknown operations intent: ${intent}`);
  }
}

async function handleSalesQueries(intent, filters) {
  switch (intent) {
    case "supervisor_sales":
    case "sales_performance":
      return await SupervisorSalesAnalyticsService.fetchSupervisorSales(filters);
    default:
      throw new Error(`Unknown sales intent: ${intent}`);
  }
}

async function handleFinanceQueries(intent, filters) {
  switch (intent) {
    case "financial_close_metrics":
      return await FinanceService.getFinancialCloseMetrics(filters);
    case "audit_trail_analysis":
      return await FinanceService.getAuditTrailAnalysis(filters);
    case "reporting_accuracy":
      return await FinanceService.getReportingAccuracy(filters);
    default:
      throw new Error(`Unknown finance intent: ${intent}`);
  }
}

async function handleITQueries(intent, filters) {
  switch (intent) {
    case "server_storage_patch":
      return await ServerStoragePatchService.fetchServerStoragePatch(filters);
    case "server_load":
    case "server_performance":
      return await ServerStoragePatchService.fetchAllServers(filters);
    case "server_load_kpis":
      return await ServerStoragePatchService.getServerLoadKPIs(filters);
    case "storage_utilization":
      return await ServerStoragePatchService.fetchAllStorages(filters);
    case "storage_kpis":
      return await ServerStoragePatchService.getStorageKPIs(filters);
    case "patch_compliance":
      return await ServerStoragePatchService.fetchAllPatchCompliance(filters);
    case "patch_compliance_kpis":
      return await ServerStoragePatchService.getPatchComplianceKPIs(filters);
    default:
      throw new Error(`Unknown IT intent: ${intent}`);
  }
}

async function handleEditorialQueries(intent) {
  // Placeholder for editorial queries - add when editorial services are available
  throw new Error(`Editorial analytics not yet implemented for intent: ${intent}`);
}

async function handleExecutiveQueries(intent) {
  // Placeholder for executive queries - add when executive services are available
  throw new Error(`Executive analytics not yet implemented for intent: ${intent}`);
}

// Legacy intent handler for backward compatibility
async function handleLegacyIntents(intent, filters) {
  switch (intent) {
    case "vendor_early_deliveries":
      return await rvsAnalyticsService.fetchAllVendors({ ...filters, delay_days: 0 });
    case "resource_utilization":
      return await rvsAnalyticsService.fetchAllResources(filters);
    case "space_optimization":
      return await rvsAnalyticsService.fetchAllSpaces(filters);
    case "production_yield":
      return await OperationsProductionAnalyticsService.fetchProductionYield(filters);
    case "machine_oee":
      return await OperationsProductionAnalyticsService.fetchMachineOEE(filters);
    case "material_waste":
      return await OperationsProductionAnalyticsService.fetchMaterialWaste(filters);
    case "supervisor_sales":
      return await SupervisorSalesAnalyticsService.fetchSupervisorSales(filters);
    case "financial_close_metrics":
      return await FinanceService.getFinancialCloseMetrics(filters);
    case "audit_trail_analysis":
      return await FinanceService.getAuditTrailAnalysis(filters);
    case "reporting_accuracy":
      return await FinanceService.getReportingAccuracy(filters);
    case "server_storage_patch":
      return await ServerStoragePatchService.fetchServerStoragePatch(filters);
    case "server_load":
      return await ServerStoragePatchService.fetchAllServers(filters);
    case "server_load_kpis":
      return await ServerStoragePatchService.getServerLoadKPIs(filters);
    case "storage_utilization":
      return await ServerStoragePatchService.fetchAllStorages(filters);
    case "storage_kpis":
      return await ServerStoragePatchService.getStorageKPIs(filters);
    case "patch_compliance":
      return await ServerStoragePatchService.fetchAllPatchCompliance(filters);
    case "patch_compliance_kpis":
      return await ServerStoragePatchService.getPatchComplianceKPIs(filters);
    default:
      throw new Error(`Unknown intent: ${intent}`);
  }
}

// Generate additional insights from data
function generateDataInsights(data) {
  const insights = [];
  
  if (!data || data.length === 0) {
    return ["No data available for the requested query."];
  }

  // Basic statistical insights
  if (typeof data[0] === 'object') {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );
    
    numericFields.forEach(field => {
      const values = data.map(item => item[field]).filter(v => v != null);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        insights.push(`${field}: Average ${avg.toFixed(2)}, Range ${min}-${max}`);
      }
    });
  }
  
  insights.push(`Total records: ${data.length}`);
  return insights.slice(0, 5); // Limit to 5 insights
}