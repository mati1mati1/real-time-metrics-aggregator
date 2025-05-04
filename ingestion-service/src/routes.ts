import { Router, Request, Response } from 'express';
import {postMessage } from './controllers/messageController';

const router = Router();

router.post('/metrics/submit', postMessage); 

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router;
