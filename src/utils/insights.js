/**
 * Generate insights and recommendations from reconciliation results
 * @param {Object} results - Reconciliation results
 * @param {Array} fileAData - Original file A data
 * @param {Array} fileBData - Original file B data
 * @returns {Object} Generated insights
 */
export const generateInsights = (results, fileAData, fileBData) => {
    const insights = {
        topMismatchedParties: findTopMismatchedParties(results),
        problematicFields: findProblematicFields(results),
        datePatterns: analyzeDatePatterns(results),
        varianceAnalysis: analyzeVariance(results),
        recommendations: [],
    };

    // Generate recommendations based on insights
    insights.recommendations = generateRecommendations(insights, results);

    return insights;
};

/**
 * Find parties with highest mismatch rates
 * @param {Object} results - Reconciliation results
 * @returns {Array} Top mismatched parties
 */
const findTopMismatchedParties = (results) => {
    const partyStats = new Map();

    // Count mismatches by party
    [...results.partial, ...results.unmatchedA, ...results.unmatchedB].forEach(
        (record) => {
            const party = record.fileA?.party || record.fileB?.party || "Unknown";

            if (!partyStats.has(party)) {
                partyStats.set(party, {
                    party,
                    mismatchCount: 0,
                    totalAmount: 0,
                    types: { partial: 0, unmatchedA: 0, unmatchedB: 0 },
                });
            }

            const stats = partyStats.get(party);
            stats.mismatchCount++;
            stats.totalAmount += Math.abs(record.variance?.amount || 0);
            stats.types[record.type]++;
        }
    );

    // Sort by mismatch count and return top 5
    return Array.from(partyStats.values())
        .sort((a, b) => b.mismatchCount - a.mismatchCount)
        .slice(0, 5)
        .map((stat) => ({
            party: stat.party,
            mismatchCount: stat.mismatchCount,
            totalAmountVariance: stat.totalAmount.toFixed(2),
            breakdown: stat.types,
        }));
};

/**
 * Identify which fields cause most discrepancies
 * @param {Object} results - Reconciliation results
 * @returns {Object} Field-wise problem analysis
 */
const findProblematicFields = (results) => {
    const fieldStats = {
        party: 0,
        date: 0,
        amount: 0,
        tax: 0,
    };

    results.partial.forEach((record) => {
        record.differences.forEach((diff) => {
            if (fieldStats.hasOwnProperty(diff.field)) {
                fieldStats[diff.field]++;
            }
        });
    });

    // Find the most problematic field
    const mostProblematic = Object.entries(fieldStats).reduce(
        (max, [field, count]) => {
            return count > max.count ? { field, count } : max;
        },
        { field: "none", count: 0 }
    );

    return {
        fieldCounts: fieldStats,
        mostProblematic: mostProblematic.field,
        totalDiscrepancies: results.partial.length,
    };
};

/**
 * Analyze date patterns in unmatched entries
 * @param {Object} results - Reconciliation results
 * @returns {Object} Date pattern analysis
 */
const analyzeDatePatterns = (results) => {
    const monthCounts = new Map();
    const yearCounts = new Map();

    // Analyze unmatched records
    [...results.unmatchedA, ...results.unmatchedB].forEach((record) => {
        const dateStr = record.fileA?.date || record.fileB?.date;
        if (!dateStr) return;

        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                const month = date.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                });
                const year = date.getFullYear();

                monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
                yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
            }
        } catch (e) {
            // Skip invalid dates
        }
    });

    // Find period with most unmatched entries
    let peakPeriod = "N/A";
    let peakCount = 0;

    monthCounts.forEach((count, month) => {
        if (count > peakCount) {
            peakCount = count;
            peakPeriod = month;
        }
    });

    return {
        peakPeriod,
        peakCount,
        monthlyDistribution: Array.from(monthCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([month, count]) => ({ month, count })),
    };
};

/**
 * Analyze variance totals and averages
 * @param {Object} results - Reconciliation results
 * @returns {Object} Variance analysis
 */
const analyzeVariance = (results) => {
    const variances = [];

    // Collect all variances
    [...results.partial, ...results.unmatchedA, ...results.unmatchedB].forEach(
        (record) => {
            if (record.variance) {
                variances.push({
                    amount: Math.abs(record.variance.amount),
                    tax: Math.abs(record.variance.tax),
                    type: record.type,
                });
            }
        }
    );

    // Calculate totals
    const totals = variances.reduce(
        (acc, v) => ({
            amount: acc.amount + v.amount,
            tax: acc.tax + v.tax,
        }),
        { amount: 0, tax: 0 }
    );

    // Calculate averages
    const count = variances.length || 1;
    const averages = {
        amount: totals.amount / count,
        tax: totals.tax / count,
    };

    // Find largest variance
    const largestVariance = variances.reduce(
        (max, v) => (v.amount > max.amount ? v : max),
        { amount: 0, tax: 0, type: "none" }
    );

    return {
        totalVariance: {
            amount: totals.amount.toFixed(2),
            tax: totals.tax.toFixed(2),
        },
        averageVariance: {
            amount: averages.amount.toFixed(2),
            tax: averages.tax.toFixed(2),
        },
        largestVariance: {
            amount: largestVariance.amount.toFixed(2),
            type: largestVariance.type,
        },
        varianceCount: count,
    };
};

/**
 * Generate actionable recommendations
 * @param {Object} insights - Generated insights
 * @param {Object} results - Reconciliation results
 * @returns {Array} List of recommendations
 */
const generateRecommendations = (insights, results) => {
    const recommendations = [];

    // Recommendation based on top mismatched parties
    if (insights.topMismatchedParties.length > 0) {
        const topParty = insights.topMismatchedParties[0];
        recommendations.push({
            priority: "high",
            category: "vendor",
            message: `Review records for "${topParty.party}" - ${topParty.mismatchCount} discrepancies found with total variance of $${topParty.totalAmountVariance}`,
            action: "Filter results by this vendor and review each transaction",
        });
    }

    // Recommendation based on problematic fields
    if (insights.problematicFields.mostProblematic !== "none") {
        const field = insights.problematicFields.mostProblematic;
        const count = insights.problematicFields.fieldCounts[field];
        recommendations.push({
            priority: "high",
            category: "field",
            message: `"${field.toUpperCase()}" field has ${count} discrepancies - most common issue`,
            action:
                field === "amount"
                    ? "Consider adjusting amount tolerance or review pricing agreements"
                    : field === "date"
                        ? "Check for timezone differences or date format inconsistencies"
                        : `Verify ${field} data entry standards between systems`,
        });
    }

    // Recommendation based on date patterns
    if (
        insights.datePatterns.peakPeriod !== "N/A" &&
        insights.datePatterns.peakCount > 3
    ) {
        recommendations.push({
            priority: "medium",
            category: "date",
            message: `${insights.datePatterns.peakCount} unmatched entries in ${insights.datePatterns.peakPeriod}`,
            action:
                "Investigate if there were system changes or special events during this period",
        });
    }

    // Recommendation based on variance
    const variance = parseFloat(insights.varianceAnalysis.totalVariance.amount);
    if (variance > 1000) {
        recommendations.push({
            priority: "high",
            category: "variance",
            message: `Total amount variance of $${insights.varianceAnalysis.totalVariance.amount} detected`,
            action:
                "Significant financial discrepancy - prioritize reconciliation of high-value transactions",
        });
    } else if (variance > 100) {
        recommendations.push({
            priority: "medium",
            category: "variance",
            message: `Amount variance of $${insights.varianceAnalysis.totalVariance.amount} detected`,
            action: "Review transactions with largest variances first",
        });
    }

    // Recommendation based on unmatched ratios
    const totalRecords =
        results.matched.length +
        results.partial.length +
        results.unmatchedA.length +
        results.unmatchedB.length;

    const unmatchedRatio =
        ((results.unmatchedA.length + results.unmatchedB.length) / totalRecords) *
        100;

    if (unmatchedRatio > 20) {
        recommendations.push({
            priority: "high",
            category: "data_quality",
            message: `${unmatchedRatio.toFixed(
                1
            )}% of records are completely unmatched`,
            action:
                "Verify that both files cover the same time period and data sources",
        });
    }

    // Recommendation based on partial matches
    const partialRatio = (results.partial.length / totalRecords) * 100;
    if (partialRatio > 30) {
        recommendations.push({
            priority: "medium",
            category: "tolerance",
            message: `${partialRatio.toFixed(
                1
            )}% of records have partial matches`,
            action:
                "Consider adjusting tolerance settings or investigate systematic data differences",
        });
    }

    // General recommendation if few issues
    if (recommendations.length === 0) {
        recommendations.push({
            priority: "low",
            category: "general",
            message: "Reconciliation quality is good with minimal discrepancies",
            action: "Review remaining partial matches and export results for records",
        });
    }

    return recommendations;
};

/**
 * Format insights for display
 * @param {Object} insights - Generated insights
 * @returns {Object} Formatted insights
 */
export const formatInsights = (insights) => {
    return {
        summary: {
            totalRecommendations: insights.recommendations.length,
            highPriority: insights.recommendations.filter(
                (r) => r.priority === "high"
            ).length,
            mediumPriority: insights.recommendations.filter(
                (r) => r.priority === "medium"
            ).length,
        },
        details: insights,
    };
};

