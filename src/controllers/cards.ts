import { NextFunction, Request, Response } from 'express';
import StatusCode from '../constants/errors';
import Card from '../models/card';
import { BadRequestError, NotFoundError } from '../errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    link,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(StatusCode.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => Card
  .deleteOne({ _id: req.params.cardId })
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }

    res.send({ data: 'success' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Карточка с указанным _id не найдена'));
    } else {
      next(err);
    }
  });

export const likeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }

    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    } else {
      next(err);
    }
  });

// eslint-disable-next-line max-len
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }

    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
    } else {
      next(err);
    }
  });
