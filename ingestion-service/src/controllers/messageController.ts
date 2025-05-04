import { Request, Response, NextFunction } from 'express';
import { metricSchema, MetricEvent } from '../validator';
import { publishMessage } from '../producer';
import logger from '../logger';

export const postMessage = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = metricSchema.validate(req.body);
    if (error) {
        logger.warn('Validation failed', { error: error.details });
        res.status(400).json({ error: error.details });
        return;
    }
    
    try {
        const metricEvent = value as MetricEvent;
        await publishMessage(metricEvent);
        res.json({ status: 'accepted' });
    } catch (err) {
        logger.error('Failed to publish message', { error: err });
        res.status(500).json({ error: 'Failed to enqueue message' });
    }
};

