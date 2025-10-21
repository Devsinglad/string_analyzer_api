"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { logEvents } = require('./logEvents');
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    res.status(status).json({
        status: false,
        data: null,
        message: err.message
    });
};
exports.default = errorHandler;
