import express from 'express';
import { validateAdviceQuery } from '../middlewares/validation';
import { advicesController } from '../controllers';

const router = express.Router();
router.post('/', validateAdviceQuery, advicesController.queryAdvice);
export default router;
