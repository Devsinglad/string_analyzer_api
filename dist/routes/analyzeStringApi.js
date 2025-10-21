"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyzeStringController_1 = require("../controllers/analyzeStringController");
const router = (0, express_1.Router)();
// Create & Analyze a new string
router.post('/strings', analyzeStringController_1.analyzeString);
// Filter using natural language query
router.get('/strings/filter-by-natural-language', analyzeStringController_1.filterByNaturalLanguage);
// Get a specific string by its value
router.get('/strings/:value', analyzeStringController_1.getStringByValue);
// Get all analyzed strings (with optional filters)
router.get('/strings', analyzeStringController_1.getAllStrings);
// Delete a string by its value
router.delete('/strings/:value', analyzeStringController_1.deleteString);
exports.default = router;
