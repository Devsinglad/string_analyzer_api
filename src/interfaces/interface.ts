

export interface HttpError extends Error {
    status: number;
}

export interface AnalyzedString {
    id: string;
    value: string;
    properties: {
        length: number;
        is_palindrome: boolean;
        unique_characters: number;
        word_count: number;
        sha256_hash: string;
        character_frequency_map: Record<string, number> | null;
    };
    created_at: Date;
}



export interface AllAnalyzedString {
    id: string;
    value: string;
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number> | null;
    created_at: Date;
}


export interface GetAnalyzeStringsRes {
    data: AnalyzedString[];
    count: number;
    filters_applied: {
        is_palindrome?: boolean;
        min_length?: number;
        max_length?: number;
        word_count?: number;
        contains_character?: string;
    };
}

export interface QueryFilters {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
}