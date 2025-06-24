import { Router } from 'express';
import {
  login,
} from '../controllers/users';
import { validateLogin } from '../validators/user';

const router = Router();

router.post('/', validateLogin, login);

export default router;
