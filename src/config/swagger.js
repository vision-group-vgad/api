import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Routes documentation for all departments",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
  },
  apis: [
    path.join(__dirname, "../departments/administrative/*.js"),
    path.join(__dirname, "../departments/common-features/notification/*.js"),
    path.join(__dirname, "../departments/editorial/*.js"),
    path.join(__dirname, "../departments/executive/*.js"),
    path.join(__dirname, "../departments/finance/*.js"),
    path.join(__dirname, "../departments/finance/budget-variance/*.js"),
    path.join(__dirname, "../departments/finance/expense-category/*.js"),
    path.join(__dirname, "../departments/finance/age-analysis/*.js"),
    path.join(__dirname, "../departments/it/server-load-piechart/*.js"),
    path.join(__dirname, "../departments/it/cyber-posture/*.js"),
    path.join(__dirname, "../departments/it/infrastructure/*.js"),
    path.join(__dirname, "../departments/it/patch-compliance/*.js"),
    path.join(__dirname, "../departments/operations/*.js"),
    path.join(__dirname, "../departments/sales/*.js"),
    path.join(__dirname, "../departments/specialized/*.js"),
    path.join(__dirname, "../auth/*.js"),
    path.join(
      __dirname,
      "../departments/it/storage-utilization-donutchart/*.js"
    ),
    path.join(
      __dirname,
      "../departments/it/storage-utilization-donutchart/*.js"
    ),
    path.join(__dirname, "../accountSettings/*.js"),
    path.join(__dirname, "../departments/it/systemHealth/*.js"),
    path.join(__dirname, "../departments/finance/reporting-acc-pie-chart/*.js"),
    path.join(__dirname, "../departments/finance/capex/*.js"),
    path.join(__dirname, "../departments/finance/total_assets_value/*.js"),
    path.join(__dirname, "../departments/finance/Asset_depreciation/*.js"),
    path.join(__dirname, "../departments/finance/gl-reconciliation/*.js"),
    path.join(__dirname, "../departments/finance/tax-provisioning/*.js"),
    path.join(__dirname, "../departments/finance/finance_forecasting/*.js"),
    path.join(__dirname, "../departments/finance/statement-variance/*.js"),
    path.join(__dirname, "../departments/finance/capex/capexController.js"),
    path.join(__dirname, "../departments/finance/dso/*.js"),
    path.join(__dirname, "../departments/finance/bad-debt-ratios/*.js"),
    path.join(__dirname, "../departments/finance/collection-efficiency/*.js"),
    path.join(
      __dirname,
      "../departments/finance/finance_forecasting/forecastingController.js"
    ),
    path.join(
      __dirname,
      "../departments/finance/systemIntegrationHealth/controller.js"
    ),
    path.join(__dirname, "../departments/editorial/editorialAnalytics/*.js"),
    path.join(__dirname, "../departments/editorial/readership-trends/*.js"),
    path.join(__dirname, "../departments/editorial/jornalistProductivity/*.js"),
    path.join(__dirname, "../departments/editorial/breakingNewsTraction/*.js"),
    path.join(__dirname, "../departments/editorial/segmentPopularity/*.js"),

    path.join(__dirname, "../departments/editorial/error-rate/*.js"),
    path.join(__dirname, "../departments/editorial/editing-cycle-times/*.js"),
    path.join(__dirname, "../departments/editorial/sect-performance/*.js"),
    path.join(__dirname, "../departments/editorial/social-sentiment/*.js"),
    path.join(__dirname, "../departments/editorial/version-control/*.js"),
  ],
};
