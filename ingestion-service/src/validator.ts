import Joi from 'joi';

export const metricSchema = Joi.object({
  metric: Joi.string().required(),
  value: Joi.number().required(),
  tags: Joi.object().optional(),
  timestamp: Joi.string().isoDate().optional(),
});

export interface MetricEvent {
  metric: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: string;
}
