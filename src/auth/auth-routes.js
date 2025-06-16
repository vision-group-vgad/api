import express from "express";
import AuthenticationController from "./auth-controller.js";
import Jwt from "./jwt.js";

const authRouter = express.Router();
const authController = new AuthenticationController();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    res.json(authController.authenticate(email, password));
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.get("/protected", Jwt.verifyToken, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

export default authRouter;
