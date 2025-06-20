import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ErrorStatusCode from './constants/errors';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const TEST_USER_ID = '6854518953649df7ffd04702';

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Успешно подключено к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.use((req: Request, _res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: TEST_USER_ID,
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode = ErrorStatusCode.INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ErrorStatusCode.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
