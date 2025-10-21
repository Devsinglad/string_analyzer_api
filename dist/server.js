"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const settings_1 = require("./config/settings");
const logEvents_1 = require("./middleware/logEvents");
const corOption_1 = __importDefault(require("./config/corOption"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const analyzeStringApi_1 = __importDefault(require("./routes/analyzeStringApi"));
const express = require('express');
const app = express();
// middleware for  Content-Type
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});
// built-in middleware for json
app.use(express.json());
// custom middleware logger
app.use(logEvents_1.logger);
// Cross Origin Resource Sharing
app.use((0, cors_1.default)(corOption_1.default));
//routes
app.use('/', analyzeStringApi_1.default);
// check for undefined routes
app.all(/.*/, (req, res, next) => {
    try {
        res.status(404);
        throw http_errors_1.default.NotFound('Route does not exist');
    }
    catch (error) {
        next(error);
    }
});
// error handler middleware
app.use(errorHandler_1.default);
app.listen(settings_1.settings.port, () => {
    console.log(`Server running on port ${settings_1.settings.port}`);
    console.log(`Profile endpoint: http://localhost:${settings_1.settings.port}`);
});
