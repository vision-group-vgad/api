import axios from "axios";

// --- Import all analytics services (use correct filenames/paths) ---
import rvsAnalyticsService from "../departments/administrative/rvsAnalytics/rvsAnalyticsService.js";
import OperationsProductionAnalyticsService from "../departments/operations/OperationsProductionAnalytics/OperationsProductionAnalyticsService.js";
import SupervisorSalesAnalyticsService from "../departments/sales/SupervisorSalesAnalytics/SupervisorSalesAnalyticsService.js";
import FinanceService from "../departments/finance/FinanceService.js";
import ServerStoragePatchService from "../departments/it/ServerStoragePatchAnalytics/ServerStoragePatchService.js";
// Add more as needed, e.g.:
// import EditorialService from "../departments/editorial/EditorialService.js";
// import HRService from "../departments/hr/HRService.js";

// --- OpenAI API Setup ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// --- Helper: Call OpenAI to interpret the question ---
async function callOpenAI(question) {
  const prompt = `
You are an analytics assistant for a media company.
You have access to analytics for sales, finance, editorial, operations, IT, and administration.
Given the user's question, return a JSON object with:
- "intent": what the user wants (e.g. "vendor_early_deliveries", "resource_utilization", "production_yield", "sales_revenue", "expense_breakdown", etc.)
- "filters": any filters (date, department, machine, operator, etc.)
- "explanation": a short explanation of how you will answer.

User question: "${question}"
Return only valid JSON.
`;

  const maxRetries = 5;
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const text = response.data.choices[0].message.content;
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("AI did not return valid JSON: " + text);
      }
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 429) {
        // Rate limit hit, wait and retry
        const delay = Math.pow(2, attempt) * 500; // exponential backoff: 0.5s, 1s, 2s, 4s, 8s
        await new Promise(res => setTimeout(res, delay));
        attempt++;
      } else {
        throw err;
      }
    }
  }
  throw new Error("OpenAI API rate limit exceeded after retries: " + (lastError && lastError.message));
}

// --- Main AI Service Function ---
export async function askAI(question) {
  const aiResult = await callOpenAI(question);

  // Optionally check user permissions here (based on 'user' param)

  let data = null;
  switch (aiResult.intent) {
    // --- Administrative ---
    case "vendor_early_deliveries":
      data = await rvsAnalyticsService.fetchAllVendors({ ...aiResult.filters, delay_days: 0 });
      break;
    case "resource_utilization":
      data = await rvsAnalyticsService.fetchAllResources(aiResult.filters);
      break;
    case "space_optimization":
      data = await rvsAnalyticsService.fetchAllSpaces(aiResult.filters);
      break;

    // --- Operations & Production ---
    case "production_yield":
      data = await OperationsProductionAnalyticsService.fetchProductionYield(aiResult.filters);
      break;
    case "machine_oee":
      data = await OperationsProductionAnalyticsService.fetchMachineOEE(aiResult.filters);
      break;
    case "material_waste":
      data = await OperationsProductionAnalyticsService.fetchMaterialWaste(aiResult.filters);
      break;

    // --- Sales ---
    case "supervisor_sales":
      data = await SupervisorSalesAnalyticsService.fetchSupervisorSales(aiResult.filters);
      break;

    // --- Finance ---
    case "financial_close_metrics":
      data = await FinanceService.getFinancialCloseMetrics(aiResult.filters);
      break;
    case "audit_trail_analysis":
      data = await FinanceService.getAuditTrailAnalysis(aiResult.filters);
      break;
    case "reporting_accuracy":
      data = await FinanceService.getReportingAccuracy(aiResult.filters);
      break;

    // --- IT ---
    case "server_storage_patch":
      data = await ServerStoragePatchService.fetchServerStoragePatch(aiResult.filters);
      break;
    case "server_load":
      data = await ServerStoragePatchService.fetchAllServers(aiResult.filters);
      break;
    case "server_load_kpis":
      data = await ServerStoragePatchService.getServerLoadKPIs(aiResult.filters);
      break;
    case "storage_utilization":
      data = await ServerStoragePatchService.fetchAllStorages(aiResult.filters);
      break;
    case "storage_kpis":
      data = await ServerStoragePatchService.getStorageKPIs(aiResult.filters);
      break;
    case "patch_compliance":
      data = await ServerStoragePatchService.fetchAllPatchCompliance(aiResult.filters);
      break;
    case "patch_compliance_kpis":
      data = await ServerStoragePatchService.getPatchComplianceKPIs(aiResult.filters);
      break;

    // --- Add more cases for all your analytics services as needed ---

    default:
      throw new Error("Unknown intent: " + aiResult.intent);
  }

  return {
    explanation: aiResult.explanation,
    data
  };
}