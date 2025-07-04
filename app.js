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
import patchComplianceController from "./src/departments/it/patch-compliance/patchComplianceRoutes.js";

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const corsOption = {
  origin: process.env.ALLOWED_ORIGIN,
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
app.use("/api/v1/patch-compliance", patchComplianceController);


export default app;
