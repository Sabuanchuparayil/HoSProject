import { Product, ProductWithTotalStock } from '../types';

/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 * @param a The first string.
 * @param b The second string.
 * @returns The number of edits to change one string into the other.
 */
const levenshteinDistance = (a: string, b: string): number => {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    
    const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
    
    for (let i = 0; i <= an; i++) matrix[0][i] = i;
    for (let j = 0; j <= bn; j++) matrix[j][0] = j;
    
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
 * Calculates a similarity score between 0 and 1 for two strings.
 * @param a The first string.
 * @param b The second string.
 * @returns A similarity score (1 for identical, 0 for completely different).
 */
const calculateSimilarity = (a: string, b: string): number => {
    const longerLength = Math.max(a.length, b.length);
    if (longerLength === 0) return 1;
    const distance = levenshteinDistance(a, b);
    return (longerLength - distance) / longerLength;
}

export type DuplicateCheckResult = {
    isDuplicate: boolean;
    reason: 'barcode' | 'sku' | 'name' | null;
    matchingProduct: ProductWithTotalStock | null;
    similarityScore?: number;
}

const FUZZY_NAME_SIMILARITY_THRESHOLD = 0.85; // 85% similarity


/**
 * Checks for potential duplicates of a new or updated product in an existing catalog.
 * The check is hierarchical: Barcode -> SKU -> Fuzzy Name Match.
 * @param productToCheck - The product being added or updated.
 * @param existingProducts - The array of all products currently in the catalog.
 * @returns A DuplicateCheckResult object with details of the check.
 */
export const findPotentialDuplicates = (
    productToCheck: Omit<Product, 'id' | 'sellerId'>, 
    existingProducts: ProductWithTotalStock[]
): DuplicateCheckResult => {
    
    const idToIgnore = 'id' in productToCheck ? (productToCheck as Product).id : -1;

    for (const existingProduct of existingProducts) {
        // Don't compare a product to itself when editing
        if (existingProduct.id === idToIgnore) {
            continue;
        }

        // 1. High Confidence: Barcode Match
        if (productToCheck.barcode) {
            if (existingProduct.barcode === productToCheck.barcode) {
                return { isDuplicate: true, reason: 'barcode', matchingProduct: existingProduct };
            }
            if (existingProduct.variations?.some(v => v.barcode === productToCheck.barcode)) {
                 return { isDuplicate: true, reason: 'barcode', matchingProduct: existingProduct };
            }
        }
        
        // 2. Medium Confidence: SKU Match
        if (productToCheck.sku) {
            if (existingProduct.sku.toLowerCase() === productToCheck.sku.toLowerCase()) {
                return { isDuplicate: true, reason: 'sku', matchingProduct: existingProduct };
            }
            if (existingProduct.variations?.some(v => v.sku.toLowerCase() === productToCheck.sku.toLowerCase())) {
                 return { isDuplicate: true, reason: 'sku', matchingProduct: existingProduct };
            }
        }
    }

    // 3. Lower Confidence: Fuzzy Name Match within the same category
    for (const existingProduct of existingProducts) {
         if (existingProduct.id === idToIgnore) {
            continue;
        }

        if (
            productToCheck.taxonomy.fandom === existingProduct.taxonomy.fandom &&
            productToCheck.taxonomy.subCategory === existingProduct.taxonomy.subCategory
        ) {
            const similarity = calculateSimilarity(productToCheck.name.en.toLowerCase(), existingProduct.name.en.toLowerCase());
            if (similarity >= FUZZY_NAME_SIMILARITY_THRESHOLD) {
                return { isDuplicate: true, reason: 'name', matchingProduct: existingProduct, similarityScore: similarity };
            }
        }
    }
    
    return { isDuplicate: false, reason: null, matchingProduct: null };
};
