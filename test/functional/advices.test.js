import request from 'supertest';
import app from 'app';
import nock from 'nock';
import 'test/helpers/dbTransaction';
import Advice from '../../app/advice/db/model';

const ADVICES_URL = 'https://api.adviceslip.com';

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

describe('advices api test', () => {
  describe('POST /advice', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('should return a 422 error if no query is passed', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({ query: null });

      expect(statusCode).toBe(422);
    });

    it('should return a 422 error if word is not string', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({
          query: {
            word: 1,
          },
        });

      expect(statusCode).toBe(422);
    });

    it('should return a 422 error if word is an empty string', async () => {
      const { statusCode } = await request(app)
        .post('/advice')
        .send({
          query: {
            word: '',
          },
        });

      expect(statusCode).toBe(422);
    });

    it('should return 404 when no advices are found for the given word', async () => {
      const apiNock = nock(ADVICES_URL)
        .get('/advice/search/test')
        .reply(200, failQueryResponse);

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
      expect(apiNock.isDone()).toBe(true);
    });

    it('should return 500 if advicesApi returns an error', async () => {
      const apiNock = nock(ADVICES_URL)
        .get('/advice/search/test')
        .replyWithError('boom');

      const { statusCode } = await request(app)
        .post('/advice')
        .send({
          query: {
            word: 'test',
          },
        });

      const advicesAfterQuery = await Advice.query();

      expect(statusCode).toBe(500);
      expect(advicesAfterQuery).toHaveLength(0);
      expect(apiNock.isDone()).toBe(true);
    });

    it('should create a new advice in the database', async () => {
      const apiNock = nock(ADVICES_URL)
        .get('/advice/search/spider')
        .reply(200, successQueryResponse);

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
      expect(apiNock.isDone()).toBe(true);
    });

    it('should not create duplicated advices in the database (api_id)', async () => {
      const apiNock = nock(ADVICES_URL)
        .get('/advice/search/spider')
        .times(2)
        .reply(200, successQueryResponse);

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
      expect(apiNock.isDone()).toBe(true);
    });
  });
});
