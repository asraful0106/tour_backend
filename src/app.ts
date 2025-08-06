import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { envVars } from './app/config/env';
import passport from 'passport';

const app: Application = express();

// For Google oAuth authentication
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// For accessing the cookie
app.use(cookieParser());
// For json data
app.use(express.json());
// For url encoded data
app.use(express.urlencoded({extended: true}));

// For allowing frontend to access backend
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send("Server is running");
});

// For handeling all route start with 'api/v1'
app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;