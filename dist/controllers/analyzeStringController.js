"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteString = exports.filterByNaturalLanguage = exports.getAllStrings = exports.getStringByValue = exports.analyzeString = void 0;
const helpers_1 = require("../utils/helpers");
const client_1 = require("@prisma/client");
const nplParser_1 = require("../utils/nplParser");
const prisma = new client_1.PrismaClient();
const analyzeString = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value } = req.body;
    try {
        if (!value) {
            return res.status(400).json({ error: 'Missing "value" field in request body' });
        }
        if (typeof value !== 'string') {
            return res.status(422).json({ error: 'Invalid data type for "value" (must be string)' });
        }
        console.log('Received string for analysis:', value);
        // Check if string already exists
        const existingString = yield prisma.postAnalyzedString.findFirst({
            where: { value }
        });
        if (existingString) {
            return res.status(409).json({ error: 'String already exists in the system' });
        }
        // Compute all properties
        const length = helpers_1.helpers.getStringLength(value);
        const is_palindrome = helpers_1.helpers.isPalindrome(value);
        const unique_characters = helpers_1.helpers.checkUniqueCharacters(value);
        const word_count = helpers_1.helpers.getWordCount(value);
        const sha256_hash = helpers_1.helpers.getShaKey(value);
        const character_frequency_map = helpers_1.helpers.getCharacterFrequencyMap(value);
        const savedAnalysis = yield prisma.postAnalyzedString.create({
            data: {
                value,
                length,
                is_palindrome,
                unique_characters,
                word_count,
                sha256_hash,
                character_frequency_map
            }
        });
        return res.status(201).json({
            id: savedAnalysis.sha256_hash,
            value: savedAnalysis.value,
            properties: {
                length: savedAnalysis.length,
                is_palindrome: savedAnalysis.is_palindrome,
                unique_characters: savedAnalysis.unique_characters,
                word_count: savedAnalysis.word_count,
                sha256_hash: savedAnalysis.sha256_hash,
                character_frequency_map: savedAnalysis.character_frequency_map
            },
            created_at: savedAnalysis.created_at
        });
    }
    catch (error) {
        next(error);
    }
});
exports.analyzeString = analyzeString;
const getStringByValue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value } = req.params;
        const string = yield prisma.postAnalyzedString.findFirst({
            where: {
                value: {
                    equals: value,
                },
            }
        });
        console.log(value);
        if (!string) {
            return res.status(404).json({
                status: false,
                message: "String not found",
            });
        }
        const response = {
            id: string.id,
            value: string.value,
            properties: {
                length: string.length,
                is_palindrome: string.is_palindrome,
                unique_characters: string.unique_characters,
                word_count: string.word_count,
                sha256_hash: string.sha256_hash,
                character_frequency_map: string.character_frequency_map,
            },
            created_at: string.created_at.toISOString(),
        };
        return res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getStringByValue = getStringByValue;
const getAllStrings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const where = {};
        // Parse filters
        const is_palindrome = query.is_palindrome === 'true' ? true : query.is_palindrome === 'false' ? false : undefined;
        const min_length = query.min_length ? Number(query.min_length) : undefined;
        const max_length = query.max_length ? Number(query.max_length) : undefined;
        const word_count = query.word_count ? Number(query.word_count) : undefined;
        const contains_character = query.contains_character;
        // Apply filters only if defined
        if (is_palindrome !== undefined) {
            where['is_palindrome'] = is_palindrome;
        }
        if (min_length !== undefined || max_length !== undefined) {
            where['length'] = {};
            if (min_length !== undefined)
                where['length'].gte = min_length;
            if (max_length !== undefined)
                where['length'].lte = max_length;
        }
        if (word_count !== undefined) {
            where['word_count'] = word_count;
        }
        if (contains_character !== undefined) {
            where['character_frequency_map'] = {
                hasKey: contains_character
            };
        }
        const strings = yield prisma.postAnalyzedString.findMany({
            where,
            orderBy: { created_at: 'desc' },
        });
        const response = {
            data: strings.map((value) => ({
                id: value.id,
                value: value.value,
                properties: {
                    length: value.value.length,
                    is_palindrome: value.is_palindrome,
                    unique_characters: value.unique_characters,
                    word_count: value.word_count,
                    sha256_hash: value.sha256_hash,
                    character_frequency_map: value.character_frequency_map,
                },
                created_at: value.created_at.toISOString(),
            })),
            count: strings.length,
            filters_applied: {
                is_palindrome,
                min_length,
                max_length,
                word_count,
                contains_character,
            }
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getAllStrings = getAllStrings;
const filterByNaturalLanguage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        // Validate query param
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        // Parse query using NLP parser
        const filters = nplParser_1.NLPParser.parse(query);
        console.log("NLP Filters:", filters);
        if (Object.keys(filters).length === 0) {
            return res.status(400).json({ error: "Unable to parse natural language query" });
        }
        // Check for conflicting filters
        if (filters.min_length && filters.max_length && filters.min_length > filters.max_length) {
            return res.status(422).json({
                error: "Query parsed but resulted in conflicting filters",
            });
        }
        // Build Prisma where clause dynamically
        const whereClause = {};
        if (filters.is_palindrome !== undefined)
            whereClause.is_palindrome = filters.is_palindrome;
        if (filters.word_count !== undefined)
            whereClause.word_count = filters.word_count;
        if (filters.min_length !== undefined)
            whereClause.length = Object.assign(Object.assign({}, (whereClause.length || {})), { gte: filters.min_length });
        if (filters.max_length !== undefined)
            whereClause.length = Object.assign(Object.assign({}, (whereClause.length || {})), { lte: filters.max_length });
        if (filters.contains_character !== undefined)
            whereClause.value = { contains: filters.contains_character };
        // Query Prisma model
        const data = yield prisma.postAnalyzedString.findMany({
            where: whereClause,
            orderBy: { created_at: "desc" },
        });
        // Handle empty results
        if (!data || data.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Strings not found",
            });
        }
        // Order parsed filters for output readability
        const orderedFilters = {};
        if (filters.word_count !== undefined)
            orderedFilters.word_count = filters.word_count;
        if (filters.is_palindrome !== undefined)
            orderedFilters.is_palindrome = filters.is_palindrome;
        for (const key of Object.keys(filters)) {
            if (key !== "word_count" && key !== "is_palindrome") {
                orderedFilters[key] = filters[key];
            }
        }
        // ✅ Return success response
        return res.status(200).json({
            data,
            count: data.length,
            interpreted_query: {
                original: query,
                parsed_filters: orderedFilters,
            },
        });
    }
    catch (error) {
        console.error("NLP Filter Error:", error);
        next(error);
    }
});
exports.filterByNaturalLanguage = filterByNaturalLanguage;
const deleteString = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value } = req.params;
    try {
        const existing = yield prisma.postAnalyzedString.findUnique({
            where: { value },
        });
        if (!existing) {
            return res.status(404).json({
                status: false,
                message: `No string found with value: ${value}`,
            });
        }
        yield prisma.postAnalyzedString.delete({
            where: { value },
        });
        console.log(`Deleted string with value: ${value}`);
        return res.status(200).json({
            status: true,
            message: 'String deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteString = deleteString;
