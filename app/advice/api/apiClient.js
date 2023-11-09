import axios from 'axios';

const API_URL = 'https://api.adviceslip.com/advice/search/';

export async function fetchAdvice(word) {
  const result = await axios.get(API_URL + word);
  const advice = result?.data?.slips?.[0];

  if (!advice) {
    const error = new Error('No advices found.');
    error.statusCode = 404;
    throw error;
  }

  return advice;
}
