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
    path.join(__dirname, "../departments/it/server-load-piechart/*.js"),
    path.join(__dirname, "../departments/it/cyber-posture/*.js"),
    path.join(__dirname, "../departments/operations/*.js"),
    path.join(__dirname, "../departments/sales/*.js"),
    path.join(__dirname, "../departments/specialized/*.js"),
    path.join(__dirname, "../auth/*.js"),
  ],
};
