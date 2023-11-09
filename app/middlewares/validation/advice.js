import { Validator } from 'express-json-validator-middleware';
const { validate } = new Validator();

export const adviceSchema = {
  $id: 'https://test-project.com/advice.schema.json',
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['word'],
    },
  },
  required: ['query'],
};

export async function validateAdviceQuery(req, res, next) {
  return validate({ body: adviceSchema })(req, res, next);
}
