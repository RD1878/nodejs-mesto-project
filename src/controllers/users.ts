import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import StatusCode from '../constants/errors';
import { BadRequestError, NotFoundError, ConflictError } from '../errors';

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;
const isProduction = NODE_ENV === 'production';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err: any) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: passwordHash,
    });

    const { password: excludedPassword, ...userWithoutPassword } = user.toObject();

    return res.status(StatusCode.CREATED).send({ data: userWithoutPassword });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    if (err.code === StatusCode.MONGOOSE_CONFLICT) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    return next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }

    return res.send({ data: user });
  } catch (err: any) {
    return next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }

    return res.send({ data: user });
  } catch (err: any) {
    return next(err);
  }
};

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
    }

    return res.send({ data: user });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    }

    return next(err);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return (new NotFoundError('Пользователь с указанным _id не найден'));
    }

    return res.send({ data: user });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }

    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, isProduction ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(StatusCode.SUCCESS).send({ message: 'Успешная авторизация' });
  } catch (err) {
    next(err);
  }
};
