import express from "express";
import path from "path";
import authRouter from "./src/auth/auth-routes.js";
import serverLoadRouter from "./src/departments/it/server-load-piechart/server-load-routes.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./src/config/swagger.js";
// import notificationRouter from "./src/departments/common-features/notification/noty-routes.js";
import storageRoutes from "./src/departments/it/storage-utilization-donutchart/storageController.js";
import cyberPostureController from "./src/departments/it/cyber-posture/cyberPostureRoutes.js";
//import accountSettingsRouter from "./src/accountSettings/controller.js";
import patchComplianceController from "./src/departments/it/patch-compliance/patchComplianceRoutes.js";
import systemHealthRoutes from "./src/departments/it/systemHealth/controller.js";
import infraRoutes from "./src/departments/it/infrastructure/InfraRoutes.js";
import financeRoutes from "./src/departments/finance/FinanceRoutes.js";
import repoAccRouter from "./src/departments/finance/reporting-acc-pie-chart/reporting-acc-piechart-routes.js";
import capExCardRouter from "./src/departments/finance/capex/capex-card-route.js";
import capExPieChartRouter from "./src/departments/finance/capex/capex-piechart-route.js";
import AssetValueRoutes from "./src/departments/finance/total_assets_value/routes.js";
import ageRouter from "./src/departments/finance/age-analysis/apArRoutes.js";
import AssetDepreciationRoutes from "./src/departments/finance/Asset_depreciation/asset_controller.js";
import expenseRouter from "./src/departments/finance/expense-category/expenseCategoryRoutes.js";
import financeForecastingRouter from "./src/departments/finance/finance_forecasting/forecastingController.js";
import glRecRouter from "./src/departments/finance/gl-reconciliation/gl-reco-route.js";
import taxProvRouter from "./src/departments/finance/tax-provisioning/tax-prov-route.js";
import statVarRouter from "./src/departments/finance/statement-variance/stat-var-routes.js";
import capExController from "./src/departments/finance/capex/capexController.js";
import dsoRouter from "./src/departments/finance/dso/dso-routes.js";
import badDebtRatiosRouter from "./src/departments/finance/bad-debt-ratios/bad-debt-ratios-routes.js";
import collEffRouter from "./src/departments/finance/collection-efficiency/coll-eff-routes.js";
import systemIntegrationHealthRoutes from "./src/departments/finance/systemIntegrationHealth/controller.js";
import budVarienceRouter from "./src/departments/finance/budget-variance/budgetVarianceRouter.js";
import errorRateRouter from "./src/departments/editorial/error-rate/error-rate-routes.js";
import editCycTimesRouter from "./src/departments/editorial/editing-cycle-times/edit-cycle-times-routes.js";
import journalistProductivity from "./src/departments/editorial/jornalistProductivity/routes.js";
import editorialAnalyticsRoutes from "./src/departments/editorial/editorialAnalytics/editorialAnalyticsRoutes.js";
import breakingNewsRoutes from "./src/departments/editorial/breakingNewsTraction/routes.js";
import segmentPopularityRoutes from "./src/departments/editorial/segmentPopularity/controller.js";
import readershipRouter from "./src/departments/editorial/readership-trends/readership-trend-routes.js";
import sectPerRouter from "./src/departments/editorial/sect-performance/sect-perform-routes.js";
import socialSentimentRouter from "./src/departments/editorial/social-sentiment/social-sentiment-routes.js";
import versionContRouter from "./src/departments/editorial/version-control/version-control-routes.js";
import router from "./src/departments/editorial/topicVirality/controller.js";
import backlogMgtRouter from "./src/departments/editorial/backlog-mgt/backlog-mgt-routes.js";
import contentFreshnessRouter from "./src/departments/editorial/contentFreshness/contentFreshnessRoute.js";
import updateFrequencyRouter from "./src/departments/editorial/updateFrequency/updateFrequencyRoute.js";
import breakingNewsRouter from "./src/departments/editorial/breaking-news/breaking-news-routes.js";
import backlogAnalyticsRouter from "./src/departments/editorial/backlogAnalytics/backlogAnalyticsRoutes.js";
import visualEngagementRoute from "./src/departments/editorial/visualAssetEngagement/controller.js";
import usageTrackingRoute from "./src/departments/editorial/usageTracking/routes.js";
import compBenchRouter from "./src/departments/editorial/competitor-benchmarking/comp-bench-routes.js";
import editorialCalendarRouter from "./src/departments/editorial/editorial-adherence/editorialCalendarRouter.js";
import rightsManagementRoute from "./src/departments/editorial/rightsManagement/routes.js";
import taskRouter from "./src/departments/administrative/task-comp-rates/task-comp-rates-routes.js";
import contentProductionRoutes from "./src/departments/editorial/content-production/contentProductionRoutes.js";
import processThroughRouter from "./src/departments/administrative/process-throughput/process-through-routes.js";
import ExecutiveMeetingAnalyticsRoutes from "./src/departments/administrative/executiveMeetingAnalytics/routes.js";
import deadlineCompliance from "./src/departments/editorial/deadline-compliance/deadlineComplianceRouter.js";
import ScheduleEfficiencyRoutes from "./src/departments/administrative/ScheduleEfficiency/routes.js";
import visionPatternRoute from "./src/departments/administrative/visitor-patterns/visitorPatternRouter.js";
import rvsAnalyticsRoutes from "./src/departments/administrative/rvsAnalytics/rvsAnalyticsRoutes.js";
import waitTimeRoute from "./src/departments/administrative/waitTime/waitTimeRoute.js";
import infraCostsRoutes from "./src/departments/it/infraCosts/routes.js";
import ticketSLARoutes from "./src/departments/it/ticket-SLA/routes.js";
import cpuUsageRoute from "./src/departments/it/cpuUsage/cpuUsageRoute.js";
import sysHealthRouter from "./src/departments/it/sys-health-score/sys-health-routes.js";
import infraCostsRouter from "./src/departments/it/infrastructure-costs/infra-costs-routes.js";
import ServerStoragePatchRoutes from "./src/departments/it/ServerStoragePatchAnalytics/ServerStoragePatchRoutes.js";
import segmentPopularityRoute from "./src/departments/editorial/segmentPopularity/routes.js";
import topNewslettersRoute from "./src/departments/editorial/topicVirality/newsLetterController.js";
import cyberSecPostRouter from "./src/departments/it/cyber-sec-posture/cyber-sec-post-routes.js";
import satisfactionRouter from "./src/departments/it/user-satisfication/userSatisficationRoute.js";
import revAttRouter from "./src/departments/sales/revenue-attribution/revenue-attribution-routes.js";
import clvRouter from "./src/departments/sales/client-life-value/clv-routes.js";
import assetInventoryRoute from "./src/departments/it/assetInventory/routes.js";
import campaignROIRoute from "./src/departments/sales/campaignROI/routes.js";
import SupervisorSalesAnalyticsRoutes from "./src/departments/sales/SupervisorSalesAnalytics/SupervisorSalesAnalyticsRoutes.js";
import OperationsProductionAnalyticsRoutes from "./src/departments/operations/OperationsProductionAnalytics/OperationsProductionAnalyticsRoutes.js";
import impressionShareRoute from "./src/departments/sales/impressionShares/controller.js";
import ctrRouter from "./src/departments/sales/ctr/ctr-routes.js";
<<<<<<< HEAD
import rateCardUtilisationRoute from "./src/departments/sales/rateCardUtilisation/controller.js";
=======
<<<<<<< Updated upstream
>>>>>>> 5b97ee994388a1e9a02a298df3be0ca6050d214d
=======
import convFunnelsRouter from "./src/departments/sales/conversion-funnels/conv-funnels-routes.js";
>>>>>>> Stashed changes
>>>>>>> bfdcbd64e6ffaf9c4575f9010d1c56d44cffe744

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const corsOption = {
  origin: ["http://localhost:5173", "https://vgad-aphb.onrender.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/assets/profile_pics",
  express.static(path.join(process.cwd(), "assets/profile_pics"))
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/server-load", serverLoadRouter);
// app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/storageUtilization", storageRoutes);
app.use("/api/v1/cyber-posture", cyberPostureController);
//app.use("/api/v1/accountSettings", accountSettingsRouter);
app.use("/api/v1/patch-compliance", patchComplianceController);
app.use("/api/v1/system-health", systemHealthRoutes);
app.use("/api/v1/infrastructure", infraRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/reporting-accu-piechart", repoAccRouter);
app.use("/api/v1/capex", capExCardRouter);
app.use("/api/v1/ap-ar-aging", ageRouter);
app.use("/api/v1/capex-piechart", capExPieChartRouter);
app.use("/api/v1/total-assets-value", AssetValueRoutes);
app.use("/api/v1/asset-depreciation", AssetDepreciationRoutes);
app.use("/api/v1/expense-category", expenseRouter);
app.use("/api/v1/budget-variance", budVarienceRouter);
app.use("/api/v1/finance-forecasting", financeForecastingRouter);
app.use("/api/v1/gl-reconciliation", glRecRouter);
app.use("/api/v1/tax-provisioning", taxProvRouter);
app.use("/api/v1/fin-statement-variance", statVarRouter);
app.use("/api/v1/capEx", capExController);
app.use("/api/v1/dso", dsoRouter);
app.use("/api/v1/bad-debt-ratios", badDebtRatiosRouter);
app.use("/api/v1/collection-efficiency", collEffRouter);
app.use("/api/v1/integration-health", systemIntegrationHealthRoutes);
app.use("/api/v1/editorial/error-rate", errorRateRouter);
app.use("/api/v1/editorial/editing-cycle-times", editCycTimesRouter);
app.use("/api/v1/editorial/journalist-productivity", journalistProductivity);
app.use("/api/v1/editorial", editorialAnalyticsRoutes);
app.use("/api/v1/editorial/breakingNews", breakingNewsRoutes);
app.use("/api/v1/editorial/segment-popularity", segmentPopularityRoutes);
app.use("/api/v1/editorial/readership-trends", readershipRouter);
app.use("/api/v1/editorial/section-perfromance", sectPerRouter);
app.use("/api/v1/editorial/social-sentiment", socialSentimentRouter);
app.use("/api/v1/editorial/version-control", versionContRouter);
app.use("/api/v1/editorial/topic-virality", router);
app.use("/api/v1/editorial/backlog-mgt", backlogMgtRouter);
app.use("/api/v1/editorial/contentFreshness", contentFreshnessRouter);
app.use("/api/v1/editorial/breaking-news", breakingNewsRouter);
app.use("/api/v1/editorial/updateFrequency", updateFrequencyRouter);
app.use("/api/v1/editorial/backlogAnalytics", backlogAnalyticsRouter);
app.use("/api/v1/editorial/visual-engagement", visualEngagementRoute);
app.use("/api/v1/editorial/visual-usage", usageTrackingRoute);
app.use("/api/v1/editorial/comp-bench", compBenchRouter);
app.use(
  "/api/v1/editorial/editorial-calendar-adherence",
  editorialCalendarRouter
);
app.use("/api/v1/editorial/rights-management", rightsManagementRoute);
app.use("/api/v1/administrative/task-comp-rates", taskRouter);
app.use("/api/v1/administrative/process-throughput", processThroughRouter);
app.use("/api/v1/editorial/content-production", contentProductionRoutes);
app.use(
  "/api/v1/admnistrative/meetingAnalytics",
  ExecutiveMeetingAnalyticsRoutes
);
app.use("/api/v1/editorial/deadline-compliance", deadlineCompliance);
app.use("/api/v1/admnistrative/scheduleEfficiency", ScheduleEfficiencyRoutes);
app.use("/api/v1/administrative/visitor-patterns", visionPatternRoute);
app.use("/api/v1/administrative/rvsAnalytics", rvsAnalyticsRoutes);
app.use("/api/v1/administrative/wait-time", waitTimeRoute);
app.use("/api/v1/IT/infrastructure-costs", infraCostsRoutes);
app.use("/api/v1/IT/sla", ticketSLARoutes);
app.use("/api/v1/it/sys-health-score", sysHealthRouter);
app.use("/api/v1/it/cpu-usage", cpuUsageRoute);
app.use("/api/v1/it/infra-costs", infraCostsRouter);
app.use("/api/v1/it/ServerStoragePatch", ServerStoragePatchRoutes);
app.use("/api/v1/editorial/segment-summary", segmentPopularityRoute);
app.use("/api/v1/editorial/newsletter-virality", topNewslettersRoute);
app.use("/api/v1/it/cycber-sec-router", cyberSecPostRouter);

app.use("/api/v1/it/cpu-usage", cpuUsageRoute);
app.use("/api/v1/it/satisfaction", satisfactionRouter);
app.use("/api/v1/sales/revenue-attribution", revAttRouter);
app.use("/api/v1/sales/client-lifetime-value", clvRouter);
app.use("/api/v1/it/assets-inventory", assetInventoryRoute);
app.use("/api/v1/sales/campaign-roi", campaignROIRoute);
app.use("/api/v1/sales/SupervisorSalesAnalytics", SupervisorSalesAnalyticsRoutes);
app.use("/api/v1/operations/OperationsProductionAnalytics", OperationsProductionAnalyticsRoutes);
app.use("/api/v1/sales/impression-shares", impressionShareRoute);
app.use(
  "/api/v1/sales/SupervisorSalesAnalytics",
  SupervisorSalesAnalyticsRoutes
);
app.use(
  "/api/v1/operations/OperationsProductionAnalytics",
  OperationsProductionAnalyticsRoutes
);
app.use("/api/v1/sales/ctr", ctrRouter);
<<<<<<< HEAD
app.use("/api/v1/sales/rate-card-utilization", rateCardUtilisationRoute);
=======
<<<<<<< Updated upstream
>>>>>>> 5b97ee994388a1e9a02a298df3be0ca6050d214d
=======
app.use("/api/v1/sales/conversion-funnels", convFunnelsRouter);
>>>>>>> Stashed changes
>>>>>>> bfdcbd64e6ffaf9c4575f9010d1c56d44cffe744

export default app;
