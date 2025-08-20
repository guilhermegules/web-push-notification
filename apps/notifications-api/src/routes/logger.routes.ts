import { Router } from 'express';
import { logger } from '../infra/logger';

const loggerRoute = Router();

loggerRoute.post('/api/logs', (req, res) => {
  logger.info(req);
});
