import express from 'express';
import { getCyberPosture } from '../cyber-posture/cyberPostureController.js';

const router = express.Router();

router.get('/', getCyberPosture);

export default router;
