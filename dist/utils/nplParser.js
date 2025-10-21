"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NLPParser = void 0;
class NLPParser {
    static parse(query) {
        const filters = {};
        if (!query || !query.trim())
            return filters;
        const lowerQuery = query.toLowerCase();
        //  Palindrome detection
        if (lowerQuery.includes("palindrome") || lowerQuery.includes("palindromic")) {
            filters.is_palindrome = true;
        }
        //  Word count detection
        if (lowerQuery.includes("single word")) {
            filters.word_count = 1;
        }
        const wordCountMatch = lowerQuery.match(/(\d+)\s*words?/);
        if (wordCountMatch) {
            filters.word_count = parseInt(wordCountMatch[1]);
        }
        //  "longer than" detection
        const longerThanMatch = lowerQuery.match(/longer than (\d+)/);
        if (longerThanMatch) {
            filters.min_length = parseInt(longerThanMatch[1]) + 1;
        }
        //  "shorter than" detection
        const shorterThanMatch = lowerQuery.match(/shorter than (\d+)/);
        if (shorterThanMatch) {
            filters.max_length = parseInt(shorterThanMatch[1]) - 1;
        }
        //  "exact length" detection
        const exactLengthMatch = lowerQuery.match(/length\s+(?:of\s+)?(\d+)/);
        if (exactLengthMatch) {
            const len = parseInt(exactLengthMatch[1]);
            filters.min_length = len;
            filters.max_length = len;
        }
        //  "contains letter/character" detection
        const containsMatch = lowerQuery.match(/contain(?:s|ing)?\s+(?:the\s+)?(?:letter\s+|character\s+)?([a-z0-9])/i);
        if (containsMatch) {
            filters.contains_character = containsMatch[1].toLowerCase();
        }
        //  "first vowel" heuristic
        if (lowerQuery.includes("first vowel")) {
            filters.contains_character = "a";
        }
        return filters;
    }
}
exports.NLPParser = NLPParser;
