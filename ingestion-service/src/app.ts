import express, { Application } from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import { connectRabbitMQ } from './producer';
import logger from './logger';
import config from 'config';

const app: Application = express();
const PORT = process.env.PORT || config.get<number>('port');

app.use(bodyParser.json());
app.use('/', router);

async function start() {
  try {
    await connectRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`Ingestion Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start service', { error: err });
    process.exit(1);
  }
}

start();
