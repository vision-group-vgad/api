import express from "express";
import authRouter from "./src/auth/auth-routes.js";
import serverLoadRouter from "./src/departments/it/server-load-piechart/server-load-routes.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./src/config/swagger.js";
import notificationRouter from "./src/departments/common-features/notification/noty-routes.js";
import storageRoutes from "./src/departments/it/storage-utilization-donutchart/storageController.js";
import cyberPostureController from "./src/departments/it/cyber-posture/cyberPostureRoutes.js";
import accountSettingsRouter from "./src/accountSettings/controller.js";
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
import expenseRouter from "./src/departments/finance/expense-cat/expenseCategoryRoutes.js";
import budVarienceRouter from "./src/departments/finance/budget-variance/budgetVarianceRouter.js";
import financeForecastingRouter from "./src/departments/finance/finance_forecasting/controller.js";
import glRecRouter from "./src/departments/finance/gl-reconciliation/gl-reco-route.js";
import taxProvRouter from "./src/departments/finance/tax-provisioning/tax-prov-route.js";
import statVarRouter from "./src/departments/finance/statement-variance/stat-var-routes.js";

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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/server-load", serverLoadRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/storageUtilization", storageRoutes);
app.use("/api/v1/cyber-posture", cyberPostureController);
app.use("/api/v1/accountSettings", accountSettingsRouter);
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
app.use("/api/v1/expense-cat", expenseRouter);
app.use("/api/v1/budget-variance", budVarienceRouter);
app.use("/api/v1/finance-forecasting", financeForecastingRouter);
app.use("/api/v1/gl-reconciliation", glRecRouter);
app.use("/api/v1/tax-provisioning", taxProvRouter);
app.use("/api/v1/fin-statement-variance", statVarRouter);

export default app;
