// * src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser()); // cookie parser use na korle req.cookies access kora jabena
app.use(cors({ origin: ['http://localhost:5173'] })); // frontend theke use korar jnw

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
