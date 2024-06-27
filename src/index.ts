import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import blogRoute from './routes/blogRoute';
import { conf } from './config/conf';
import errorHandler from './utils/errorHandler';
import AppError from './utils/appError';
import { HTTPStatusCode } from './constants';

const app: Express = express();
const port: number = Number(conf.PORT) || 3500;

if (conf.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req: Request, res: Response, _next: NextFunction) => {
  res.status(200).send('Hello');
});

app.use(express.json({ limit: '50kb' }));

app.use('/api/users', userRoute);

app.use('/api/auth', authRoute);

app.use('/api/blogs', blogRoute);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      'Resource not found: The requested route does not exist',
      HTTPStatusCode.NotFound
    )
  );
});

app.use(errorHandler.handleError);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
