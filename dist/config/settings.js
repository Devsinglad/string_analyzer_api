"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
require('dotenv').config();
const port = process.env.PORT || 3000;
;
exports.settings = {
    port,
};
