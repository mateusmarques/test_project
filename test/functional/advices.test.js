import request from 'supertest';
import app from 'app';
import nock from 'nock';
import 'test/helpers/dbTransaction';
import Advice from '../../app/advice/model';

const successQueryResponse = {
  slips: [
    {
      id: 1,
      advice: 'spider',
      date: '2015-05-26',
    },
  ],
};

const failQueryResponse = {
  message: {
    type: 'notice',
    text: 'No advice slips found matching that search term.',
  },
};

nock('https://api.adviceslip.com')
  .get('/advice/search/spider')
  .times(3)
  .reply(200, successQueryResponse)
  .get('/advice/search/test')
  .reply(200, failQueryResponse);

describe('advices api test', () => {
  describe('POST /advice', () => {
    it('should return a 400 error if no query is passed', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({ query: null });

      expect(statusCode).toBe(400);
    });

    it('should create a new advice in the database', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({
          query: {
            word: 'spider',
          },
        });

      const advicesAfterQuery = await Advice.query();

      expect(statusCode).toBe(200);
      expect(advicesAfterQuery).toHaveLength(1);
    });

    it('should not create duplicated advices in the database (api_id)', async () => {
      //first query
      const result1 = request(app)
        .post('/advice')
        .send({
          query: {
            word: 'spider',
          },
        });

      //second query
      const result2 = request(app)
        .post('/advice')
        .send({
          query: {
            word: 'spider',
          },
        });

      const result = await Promise.all([result1, result2]);

      const advicesAfterQuery = await Advice.query();

      expect(result[0]?.statusCode).toBe(200);
      expect(result[1]?.statusCode).toBe(200);
      expect(result[0]?.body?.apiId).toEqual(result[1]?.body?.apiId);
      expect(advicesAfterQuery).toHaveLength(1);
    });

    it('should return 404 when no advices are found for the given word', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({
          query: {
            word: 'test',
          },
        });

      const advicesAfterQuery = await Advice.query();

      expect(statusCode).toBe(404);
      expect(advicesAfterQuery).toHaveLength(0);
    });
  });
});
