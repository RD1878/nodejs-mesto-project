import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import errorHandler from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import usersRouter from './routes/users';
import signinRouter from './routes/signin';
import signupRouter from './routes/signup';
import cardsRouter from './routes/cards';
import { NotFoundError } from './errors';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Успешно подключено к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.use(requestLogger);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
