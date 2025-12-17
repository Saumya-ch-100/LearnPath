import express from 'express';
import { createLog, getUserLogs } from '../controllers/log.controller.js';

const router = express.Router();

router.post('/', createLog);
router.get('/', getUserLogs);

export default router;
