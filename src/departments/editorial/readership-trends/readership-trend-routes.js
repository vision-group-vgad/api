import express from "express";
import ReadershipTrendController from "./ReadershipTrendController.js";
import Jwt from "../../../auth/jwt.js";

const readershipController = new ReadershipTrendController();
const readershipRouter = express.Router();

export default readershipRouter;
