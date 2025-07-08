// routes/apArRoutes.js
import express from 'express';
import { getApArAging } from './apArController.js';

const ageRouter = express.Router();

/**
 * @route GET /api/v1/ap-ar-aging
 */
ageRouter.get('/', getApArAging);

export default ageRouter;
