import { celebrate, Joi } from 'celebrate';
import urlPattern from '../constants/patterns';

const validateGetUser = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(
      urlPattern,
    ),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlPattern),
  }),
});

export {
  validateGetUser, validateUpdateUserInfo, validateUpdateUserAvatar, validateLogin, validateSignup,
};
