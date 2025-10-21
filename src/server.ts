import { Request, Response, NextFunction } from "express";
import cors from "cors";
import createHttpError from "http-errors";
import { settings } from "./config/settings";
import { logger } from "./middleware/logEvents";
import corsOptions from "./config/corOption";
import errorHandler from "./middleware/errorHandler";
import router from "./routes/analyzeStringApi";

const express = require('express');

const app = express();

// middleware for  Content-Type
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// built-in middleware for json
app.use(express.json());

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


//routes

app.use('/', router);

// check for undefined routes
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(404);
        throw createHttpError.NotFound('Route does not exist');
    } catch (error) {
        next(error);
    }
});

// error handler middleware
app.use(errorHandler);



app.listen(settings.port, () => {
    console.log(`Server running on port ${settings.port}`);
        console.log(`Profile endpoint: http://localhost:${settings.port}`);

});

