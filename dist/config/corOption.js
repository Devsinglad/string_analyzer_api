"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = require("./allowedOrigins");
const corsOptions = {
    origin: (origin, callback) => {
        if ((origin && allowedOrigins_1.allowedOrigins.includes(origin)) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    allowedHeaders: allowedOrigins_1.allowedHeaders,
};
exports.default = corsOptions;
