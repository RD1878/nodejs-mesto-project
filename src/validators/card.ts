import { celebrate, Joi } from 'celebrate';

const validateCreateCard = celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri({
      scheme: ['http', 'https', 'ftp', 'cdn'],
    }).required(),
  },
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

export { validateCreateCard, validateCardId };
