// * src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  res.send('Welcome to University Management System!');
};

app.get('/', test);

// error handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
