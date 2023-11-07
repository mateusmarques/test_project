import express from 'express';
import axios from 'axios';
import createError from 'http-errors';
import { insertAdvice } from '../app/advice';

const router = express.Router();

const API_URL = 'https://api.adviceslip.com/advice/search/';

router.post('/', async (req, res, next) => {
  try {
    const word = req?.body?.query?.word;

    if (!word) {
      return next(createError(400, 'Bad request: word is required!'));
    }

    const result = await axios.get(API_URL + word);

    const advice = result?.data?.slips?.[0];

    if (!advice) {
      return next(createError(404, 'No advice found. Try another word.'));
    }

    const toSave = {
      advice: advice?.advice,
      date: advice?.date,
      apiId: advice?.id,
    };

    const saveResult = await insertAdvice(toSave);

    res.json(saveResult);
  } catch (error) {
    console.error(error.message);
    next(createError(500, error.message));
  }
});

export default router;
