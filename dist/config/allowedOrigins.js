"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedHeaders = exports.allowedOrigins = void 0;
exports.allowedOrigins = [
    "http://localhost:3000",
];
exports.allowedHeaders = [
    'Access-Control-Allow-Origin', '*',
    'Access-Control-Allow-Methods', 'GET, OPTIONS',
    'Access-Control-Allow-Headers', 'Content-Type',
];
