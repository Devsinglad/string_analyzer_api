const crypto = require('crypto');


const getStringLength = (str: string): number => {
    return str.trim().length;
};

const isPalindrome = (str: string): boolean => {
    const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleanedStr === cleanedStr.split('').reverse().join('');
}

const checkUniqueCharacters = (str: string): number => {
    const cleanedStr = str.toLowerCase();
    const charSet = new Set(cleanedStr);
    return charSet.size;
}

const getWordCount = (str: string): number => {
    if (!str) return 0;

    // filter is used to exclude empty strings resulting from multiple spaces
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

const getShaKey = (str: string): string => {

    return crypto.createHash('sha256').update(str).digest('hex');
}

const getCharacterFrequencyMap = (str: string): Record<string, number> => {
    // This returns a map of ALL characters and their counts
    const charCount: Record<string, number> = {};

    for (let char of str.trim().toLowerCase()) {

        /// Skip spaces
        if (char === ' ') {
            continue;
        }
        charCount[char] = (charCount[char] || 0) + 1;
    }

    return charCount;
};


export const helpers = {
    getStringLength,
    isPalindrome,
    checkUniqueCharacters,
    getWordCount,
    getShaKey,
    getCharacterFrequencyMap
}