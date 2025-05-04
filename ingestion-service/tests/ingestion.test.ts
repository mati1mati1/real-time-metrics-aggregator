import request from 'supertest';
import express, { Application } from 'express';
import router from '../src/routes';
import bodyParser from 'body-parser';

const app: Application = express();
app.use(bodyParser.json());
app.use('/', router);

describe('Ingestion Service', () => {
  it('should accept a valid metric event', async () => {
    const response = await request(app)
      .post('/metrics/submit')
      .send({
        metric: 'page_view',
        value: 1,
        tags: { user_id: 'abc123' },
        timestamp: new Date().toISOString(),
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'accepted');
  });

  it('should reject an invalid metric event', async () => {
    const response = await request(app)
      .post('/metrics/submit')
      .send({
        metric: 'page_view',
        // missing 'value' field
        tags: { user_id: 'abc123' },
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

jest.mock('../src/producer', () => ({
    publishMessage: jest.fn().mockResolvedValue(undefined),
  }));