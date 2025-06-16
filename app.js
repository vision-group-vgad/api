import express from "express";
import authRouter from "./src/auth/auth-routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);

export default app;
