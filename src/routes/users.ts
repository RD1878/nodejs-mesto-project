import { Router } from 'express';
import {
  getUsers, getUser, getCurrentUser, updateUserInfo, updateUserAvatar,
} from '../controllers/users';
import { validateGetUser, validateUpdateUserAvatar, validateUpdateUserInfo } from '../validators/user';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default router;
