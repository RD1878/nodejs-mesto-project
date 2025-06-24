import { NextFunction, Request, Response } from 'express';
import StatusCode from '../constants/errors';
import Card from '../models/card';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      link,
    } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    res.status(StatusCode.CREATED).send({ data: card });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    }

    if (String(card.owner) !== req.user._id) {
      return next(new ForbiddenError('Удаление запрещено'));
    }

    await Card
      .deleteOne({ _id: cardId });

    return res.send({ data: 'success' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Карточка с указанным _id не найдена'));
    }

    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }

    return res.send({ data: card });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    }

    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }

    return res.send({ data: card });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
    }

    return next(err);
  }
};
