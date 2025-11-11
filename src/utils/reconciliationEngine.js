import { parseISO, differenceInDays, isValid } from "date-fns";

/**
 * Main reconciliation function
 * @param {Array} fileAData - Normalized data from file A
 * @param {Array} fileBData - Normalized data from file B
 * @param {Object} config - Reconciliation configuration
 * @returns {Object} Categorized reconciliation results
 */
export const reconcileData = (fileAData, fileBData, config) => {
    const { amountTolerance = 5, dateTolerance = 3 } = config;

    // Create maps for quick lookup
    const fileAMap = new Map();
    const fileBMap = new Map();

    fileAData.forEach((row) => {
        fileAMap.set(row.docNo, row);
    });

    fileBData.forEach((row) => {
        fileBMap.set(row.docNo, row);
    });

    const results = {
        matched: [],
        partial: [],
        unmatchedA: [],
        unmatchedB: [],
    };

    // Process File A records
    fileAData.forEach((rowA) => {
        const rowB = fileBMap.get(rowA.docNo);

        if (!rowB) {
            // Document only exists in File A
            results.unmatchedA.push({
                type: "unmatchedA",
                docNo: rowA.docNo,
                fileA: rowA,
                fileB: null,
                differences: [],
                variance: {
                    amount: rowA.amount,
                    tax: rowA.tax,
                },
            });
        } else {
            // Document exists in both files - compare fields
            const comparison = compareRecords(rowA, rowB, {
                amountTolerance,
                dateTolerance,
            });

            if (comparison.isMatch) {
                results.matched.push({
                    type: "matched",
                    docNo: rowA.docNo,
                    fileA: rowA,
                    fileB: rowB,
                    differences: [],
                    variance: {
                        amount: 0,
                        tax: 0,
                    },
                });
            } else {
                results.partial.push({
                    type: "partial",
                    docNo: rowA.docNo,
                    fileA: rowA,
                    fileB: rowB,
                    differences: comparison.differences,
                    variance: {
                        amount: rowB.amount - rowA.amount,
                        tax: rowB.tax - rowA.tax,
                    },
                });
            }
        }
    });

    // Process File B records that don't exist in File A
    fileBData.forEach((rowB) => {
        if (!fileAMap.has(rowB.docNo)) {
            results.unmatchedB.push({
                type: "unmatchedB",
                docNo: rowB.docNo,
                fileA: null,
                fileB: rowB,
                differences: [],
                variance: {
                    amount: -rowB.amount,
                    tax: -rowB.tax,
                },
            });
        }
    });

    return results;
};

/**
 * Compare two records and identify differences
 * @param {Object} rowA - Record from file A
 * @param {Object} rowB - Record from file B
 * @param {Object} config - Comparison configuration
 * @returns {Object} Comparison result with differences
 */
export const compareRecords = (rowA, rowB, config) => {
    const { amountTolerance, dateTolerance } = config;
    const differences = [];

    // Compare party names
    if (!compareParty(rowA.party, rowB.party)) {
        differences.push({
            field: "party",
            valueA: rowA.party,
            valueB: rowB.party,
            match: false,
        });
    }

    // Compare dates
    const dateMatch = compareDate(rowA.date, rowB.date, dateTolerance);
    if (!dateMatch.match) {
        differences.push({
            field: "date",
            valueA: rowA.date,
            valueB: rowB.date,
            match: false,
            daysDifference: dateMatch.daysDifference,
        });
    }

    // Compare amounts
    const amountMatch = compareAmount(rowA.amount, rowB.amount, amountTolerance);
    if (!amountMatch.match) {
        differences.push({
            field: "amount",
            valueA: rowA.amount,
            valueB: rowB.amount,
            match: false,
            variance: amountMatch.variance,
            percentageDiff: amountMatch.percentageDiff,
        });
    }

    // Compare tax (if both have tax values)
    if (rowA.tax > 0 || rowB.tax > 0) {
        const taxMatch = compareAmount(rowA.tax, rowB.tax, amountTolerance);
        if (!taxMatch.match) {
            differences.push({
                field: "tax",
                valueA: rowA.tax,
                valueB: rowB.tax,
                match: false,
                variance: taxMatch.variance,
                percentageDiff: taxMatch.percentageDiff,
            });
        }
    }

    return {
        isMatch: differences.length === 0,
        differences,
    };
};

/**
 * Compare document numbers (exact match)
 * @param {string} docNoA - Document number from file A
 * @param {string} docNoB - Document number from file B
 * @returns {boolean} True if exact match
 */
export const compareDocNo = (docNoA, docNoB) => {
    return docNoA.trim().toLowerCase() === docNoB.trim().toLowerCase();
};

/**
 * Compare party names (case-insensitive, trimmed)
 * @param {string} partyA - Party name from file A
 * @param {string} partyB - Party name from file B
 * @returns {boolean} True if match
 */
export const compareParty = (partyA, partyB) => {
    const normalizeParty = (party) => {
        return party
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ""); // Remove special characters
    };

    return normalizeParty(partyA) === normalizeParty(partyB);
};

/**
 * Compare dates with tolerance
 * @param {string} dateA - Date from file A
 * @param {string} dateB - Date from file B
 * @param {number} dayTolerance - Acceptable day difference (default: 3)
 * @returns {Object} Match result with day difference
 */
export const compareDate = (dateA, dateB, dayTolerance = 3) => {
    try {
        // Try to parse dates in various formats
        const parsedA = parseDate(dateA);
        const parsedB = parseDate(dateB);

        if (!parsedA || !parsedB) {
            // If dates can't be parsed, compare as strings
            return {
                match: dateA.trim() === dateB.trim(),
                daysDifference: null,
            };
        }

        const daysDiff = Math.abs(differenceInDays(parsedA, parsedB));

        return {
            match: daysDiff <= dayTolerance,
            daysDifference: daysDiff,
        };
    } catch (error) {
        // Fallback to string comparison
        return {
            match: dateA.trim() === dateB.trim(),
            daysDifference: null,
        };
    }
};

/**
 * Parse date from string with multiple format support
 * @param {string} dateStr - Date string
 * @returns {Date|null} Parsed date or null
 */
const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // Try ISO format first
    let date = parseISO(dateStr);
    if (isValid(date)) return date;

    // Try native Date parsing
    date = new Date(dateStr);
    if (isValid(date)) return date;

    // Try common formats: DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY
    const formats = [
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
    ];

    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            const [, p1, p2, p3] = match;
            // Try different date part arrangements
            const attempts = [
                new Date(p3, p2 - 1, p1), // DD/MM/YYYY
                new Date(p3, p1 - 1, p2), // MM/DD/YYYY
                new Date(p1, p2 - 1, p3), // YYYY/MM/DD
            ];

            for (const attempt of attempts) {
                if (isValid(attempt)) return attempt;
            }
        }
    }

    return null;
};

/**
 * Compare amounts with percentage-based tolerance
 * @param {number} amountA - Amount from file A
 * @param {number} amountB - Amount from file B
 * @param {number} tolerance - Percentage tolerance (default: 5%)
 * @returns {Object} Match result with variance details
 */
export const compareAmount = (amountA, amountB, tolerance = 5) => {
    const a = parseFloat(amountA) || 0;
    const b = parseFloat(amountB) || 0;

    const variance = Math.abs(b - a);
    const baseAmount = Math.max(Math.abs(a), Math.abs(b));

    // Avoid division by zero
    if (baseAmount === 0) {
        return {
            match: variance === 0,
            variance: variance,
            percentageDiff: 0,
        };
    }

    const percentageDiff = (variance / baseAmount) * 100;

    return {
        match: percentageDiff <= tolerance,
        variance: b - a, // Positive if B > A, negative if A > B
        percentageDiff: percentageDiff,
    };
};

/**
 * Calculate summary statistics from reconciliation results
 * @param {Object} results - Reconciliation results
 * @returns {Object} Summary statistics
 */
export const calculateSummary = (results) => {
    const totalRecords =
        results.matched.length +
        results.partial.length +
        results.unmatchedA.length +
        results.unmatchedB.length;

    const matchedPercentage =
        totalRecords > 0 ? (results.matched.length / totalRecords) * 100 : 0;

    const partialPercentage =
        totalRecords > 0 ? (results.partial.length / totalRecords) * 100 : 0;

    // Calculate total variance
    const totalVariance = {
        amount: 0,
        tax: 0,
    };

    [...results.partial, ...results.unmatchedA, ...results.unmatchedB].forEach(
        (record) => {
            totalVariance.amount += record.variance.amount;
            totalVariance.tax += record.variance.tax;
        }
    );

    return {
        totalRecords,
        matchedCount: results.matched.length,
        matchedPercentage: matchedPercentage.toFixed(2),
        partialCount: results.partial.length,
        partialPercentage: partialPercentage.toFixed(2),
        unmatchedACount: results.unmatchedA.length,
        unmatchedBCount: results.unmatchedB.length,
        totalVariance,
    };
};

