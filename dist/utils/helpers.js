"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = void 0;
const crypto = require('crypto');
const getStringLength = (str) => {
    return str.trim().length;
};
const isPalindrome = (str) => {
    const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleanedStr === cleanedStr.split('').reverse().join('');
};
const checkUniqueCharacters = (str) => {
    const cleanedStr = str.toLowerCase();
    const charSet = new Set(cleanedStr);
    return charSet.size;
};
const getWordCount = (str) => {
    if (!str)
        return 0;
    // filter is used to exclude empty strings resulting from multiple spaces
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};
const getShaKey = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
};
const getCharacterFrequencyMap = (str) => {
    // This returns a map of ALL characters and their counts
    const charCount = {};
    for (let char of str.trim().toLowerCase()) {
        /// Skip spaces
        if (char === ' ') {
            continue;
        }
        charCount[char] = (charCount[char] || 0) + 1;
    }
    return charCount;
};
exports.helpers = {
    getStringLength,
    isPalindrome,
    checkUniqueCharacters,
    getWordCount,
    getShaKey,
    getCharacterFrequencyMap
};
