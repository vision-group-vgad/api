import { makeAPIRequestGET } from './baseHandler.js';

export async function handleLegacyIntents(intent, filters, token, roleCode) {
  switch (intent) {
    case "vendor_early_deliveries":
      return await makeAPIRequestGET("/api/v1/administrative/rvsAnalytics", token, roleCode);
    case "space_optimization":
      return await makeAPIRequestGET("/api/v1/administrative/rvsAnalytics", token, roleCode);
    case "server_load":
    case "server_load_kpis":
      return await makeAPIRequestGET("/api/v1/server-load", token, roleCode);
    case "storage_kpis":
      return await makeAPIRequestGET("/api/v1/storageUtilization", token, roleCode);
    case "patch_compliance_kpis":
      return await makeAPIRequestGET("/api/v1/patch-compliance", token, roleCode);
    default:
      throw new Error(`Unknown legacy intent: ${intent}`);
  }
}