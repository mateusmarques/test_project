import { fetchAdvice, insertAdvice } from '../advice';

async function queryAdvice(req, res, next) {
  try {
    const word = req.body.query.word;
    const advice = await fetchAdvice(word);
    const saveResult = await insertAdvice(advice);
    res.json(saveResult);
  } catch (error) {
    next(error);
  }
}

export const advicesController = {
  queryAdvice,
};
