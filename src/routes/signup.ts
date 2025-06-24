import { Router } from 'express';
import {
  createUser,
} from '../controllers/users';
import { validateSignup } from '../validators/user';

const router = Router();

router.post('/', validateSignup, createUser);

export default router;
