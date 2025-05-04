import amqp, { Channel } from 'amqplib';
import logger from './logger';
import { MetricEvent } from './validator';
import config from 'config';

const rabbitUrl = config.get<string>('rabbitmq.url');
const queueName = config.get<string>('rabbitmq.queue');
let channel: Channel;

export async function connectRabbitMQ(retries = 10, delay = 5000) {
    while (retries > 0) {
      try {
        const conn = await amqp.connect(rabbitUrl);
        channel = await conn.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        logger.info('Connected to RabbitMQ');
        return;
      } catch (err) {
        logger.warn(`RabbitMQ connection failed. Retries left: ${retries - 1}`);
        retries--;
        if (retries === 0) throw err;
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

export async function publishMessage(message: MetricEvent) {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  channel.sendToQueue('metrics-events', Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  logger.info('Message published to queue');
}
