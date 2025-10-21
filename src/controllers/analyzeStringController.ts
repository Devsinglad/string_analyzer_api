import { NextFunction, Request, Response } from 'express';
import { helpers } from '../utils/helpers';
import { PrismaClient } from '@prisma/client';
import { AllAnalyzedString, AnalyzedString, GetAnalyzeStringsRes } from '../interfaces/interface';
import { NLPParser } from '../utils/nplParser';

const prisma = new PrismaClient();

export const analyzeString = async (req: Request, res: Response, next: NextFunction) => {
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
        const existingString = await prisma.postAnalyzedString.findFirst({
            where: { value }
        });

        if (existingString) {
            return res.status(409).json({ error: 'String already exists in the system' });
        }

        // Compute all properties
        const length = helpers.getStringLength(value);
        const is_palindrome = helpers.isPalindrome(value);
        const unique_characters = helpers.checkUniqueCharacters(value);
        const word_count = helpers.getWordCount(value);
        const sha256_hash = helpers.getShaKey(value);
        const character_frequency_map = helpers.getCharacterFrequencyMap(value);

        const savedAnalysis = await prisma.postAnalyzedString.create({
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
    } catch (error) {
        next(error);
    }
};


export const getStringByValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value } = req.params;

        const string = await prisma.postAnalyzedString.findFirst({
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
        const response: AnalyzedString = {
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
    } catch (error) {
        next(error);
    }

};

export const getAllStrings = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const query = req.query;
        const where: any = {};

        // Parse filters
        const is_palindrome = query.is_palindrome === 'true' ? true : query.is_palindrome === 'false' ? false : undefined;
        const min_length = query.min_length ? Number(query.min_length) : undefined;
        const max_length = query.max_length ? Number(query.max_length) : undefined;
        const word_count = query.word_count ? Number(query.word_count) : undefined;
        const contains_character = query.contains_character as string | undefined;

        // Apply filters only if defined
        if (is_palindrome !== undefined) {
            where['is_palindrome'] = is_palindrome;
        }

        if (min_length !== undefined || max_length !== undefined) {
            where['length'] = {};
            if (min_length !== undefined) where['length'].gte = min_length;
            if (max_length !== undefined) where['length'].lte = max_length;
        }

        if (word_count !== undefined) {
            where['word_count'] = word_count;
        }

        if (contains_character !== undefined) {
            where['character_frequency_map'] = {
                hasKey: contains_character
            };
        }

        const strings: AllAnalyzedString[] = await prisma.postAnalyzedString.findMany({
            where,
            orderBy: { created_at: 'desc' },
        });

        const response: GetAnalyzeStringsRes = {
            data: strings.map((value): AnalyzedString => ({
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
    } catch (error) {
        console.log(error);
        next(error);
    }
};




export const filterByNaturalLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query as { query: string };

        // Validate query param
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // Parse query using NLP parser
        const filters = NLPParser.parse(query);
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
        const whereClause: Record<string, any> = {};

        if (filters.is_palindrome !== undefined)
            whereClause.is_palindrome = filters.is_palindrome;

        if (filters.word_count !== undefined)
            whereClause.word_count = filters.word_count;

        if (filters.min_length !== undefined)
            whereClause.length = { ...(whereClause.length || {}), gte: filters.min_length };

        if (filters.max_length !== undefined)
            whereClause.length = { ...(whereClause.length || {}), lte: filters.max_length };

        if (filters.contains_character !== undefined)
            whereClause.value = { contains: filters.contains_character };

        // Query Prisma model
        const data = await prisma.postAnalyzedString.findMany({
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
        const orderedFilters: Record<string, any> = {};
        if (filters.word_count !== undefined)
            orderedFilters.word_count = filters.word_count;
        if (filters.is_palindrome !== undefined)
            orderedFilters.is_palindrome = filters.is_palindrome;

        for (const key of Object.keys(filters)) {
            if (key !== "word_count" && key !== "is_palindrome") {
                orderedFilters[key] = (filters as any)[key];
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
    } catch (error) {
        console.error("NLP Filter Error:", error);
        next(error);
    }
};


export const deleteString = async (req: Request, res: Response, next: NextFunction) => {
    const { value } = req.params;

    try {
        const existing = await prisma.postAnalyzedString.findUnique({
            where: { value },
        });

        if (!existing) {
            return res.status(404).json({
                status: false,
                message: `No string found with value: ${value}`,
            });
        }

        await prisma.postAnalyzedString.delete({
            where: { value },
        });

        console.log(`Deleted string with value: ${value}`);
        return res.status(200).json({
            status: true,
            message: 'String deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
