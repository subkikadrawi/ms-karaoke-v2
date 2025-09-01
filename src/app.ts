import express, {Express} from 'express';
import bodyParser from 'body-parser';
import {indexRouter} from './routes/IndexRouter';
import errorHandler from './app/https/middleware/ErrorMiddleware';
import mainMiddleware from './app/https/middleware/MainRequestMiddleware';
import loggerMiddleware from './app/https/middleware/LoggerMiddleware';
import {BaseErrorResource} from './app/https/resources/BaseErrorResource';
import cors, {CorsOptions} from 'cors';
import {whitelistCors} from './app/configs/CorsConfig';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(mainMiddleware);
app.use(loggerMiddleware);

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (whitelistCors.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

app.use(indexRouter);

app.use((req, res, next) => {
  next(
    BaseErrorResource.NotFound(
      `Route [${req.method}] - [${req.originalUrl}] - Not found`,
    ),
  );
});

app.use(errorHandler);

export default app;
