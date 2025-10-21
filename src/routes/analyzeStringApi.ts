import { Router } from "express";
import {
    analyzeString,
    deleteString,
    filterByNaturalLanguage,
    getAllStrings,
    getStringByValue
} from "../controllers/analyzeStringController";

const router = Router();

// Create & Analyze a new string
router.post('/strings', analyzeString);

// Filter using natural language query
router.get('/strings/filter-by-natural-language', filterByNaturalLanguage);


// Get a specific string by its value
router.get('/strings/:value', getStringByValue);

// Get all analyzed strings (with optional filters)
router.get('/strings', getAllStrings);



// Delete a string by its value
router.delete('/strings/:value', deleteString);

export default router;
