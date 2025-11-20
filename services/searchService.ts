/**
 * Calculates the Levenshtein distance between two strings.
 * This is the number of edits (insertions, deletions, or substitutions)
 * required to change one string into the other.
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance.
 */
export const levenshteinDistance = (a: string, b: string): number => {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    
    const matrix = new Array(bn + 1);
    for (let i = 0; i <= bn; i++) {
        matrix[i] = new Array(an + 1);
    }
    
    for (let i = 0; i <= an; i++) {
        matrix[0][i] = i;
    }
    
    for (let j = 0; j <= bn; j++) {
        matrix[j][0] = j;
    }
    
    for (let j = 1; j <= bn; j++) {
        for (let i = 1; i <= an; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,      // Deletion
                matrix[j - 1][i] + 1,      // Insertion
                matrix[j - 1][i - 1] + cost // Substitution
            );
        }
    }
    
    return matrix[bn][an];
};


/**
 * Performs a fuzzy match between a query and a text string.
 * It returns true if every word in the query finds a fuzzy match
 * in the words of the text.
 * @param query The search query.
 * @param text The text to match against.
 * @returns True if it's a fuzzy match, false otherwise.
 */
export const fuzzyMatch = (query: string, text: string): boolean => {
    if (!query) return true; // Empty query matches everything
    
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // For performance, a direct substring match is a quick win.
    if (lowerText.includes(lowerQuery)) {
        return true;
    }

    const queryWords = lowerQuery.split(/\s+/).filter(q => q.length > 0);
    const textWords = lowerText.split(/\s+/);

    // Every word in the user's query must find a fuzzy match among the product name's words.
    return queryWords.every(queryWord => {
        // The threshold for mistakes is proportional to the word's length.
        // A short word like "wand" can have 1 mistake. A longer word like "gryffindor" can have 2.
        const maxDistance = Math.floor(queryWord.length / 5) + 1;
        
        // Check if any word in the product name is close enough to the query word.
        return textWords.some(textWord => {
            // A simple "startsWith" check is fast and covers cases where a user hasn't finished typing.
            if (textWord.startsWith(queryWord)) {
                return true;
            }
            
            const distance = levenshteinDistance(queryWord, textWord);
            return distance <= maxDistance;
        });
    });
};
