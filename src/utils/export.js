/**
 * Export reconciliation results to CSV
 * @param {Array} data - Reconciliation results to export
 * @param {string} filename - Name of the file to download
 * @param {Object} options - Export options
 */
export const exportToCSV = (data, filename = "reconciliation_results.csv", options = {}) => {
    const { includeVariance = true, includeDetails = true } = options;

    if (!data || data.length === 0) {
        console.warn("No data to export");
        return;
    }

    // Define CSV headers
    const headers = [
        "Type",
        "Document No",
        "Party Name (File A)",
        "Party Name (File B)",
        "Date (File A)",
        "Date (File B)",
        "Amount (File A)",
        "Amount (File B)",
        "Tax (File A)",
        "Tax (File B)",
    ];

    if (includeVariance) {
        headers.push("Amount Variance", "Tax Variance");
    }

    if (includeDetails) {
        headers.push("Differences", "Status");
    }

    // Convert data to CSV rows
    const rows = data.map((record) => {
        const row = [
            record.type.toUpperCase(),
            record.docNo || "",
            record.fileA?.party || "",
            record.fileB?.party || "",
            record.fileA?.date || "",
            record.fileB?.date || "",
            record.fileA?.amount?.toFixed(2) || "",
            record.fileB?.amount?.toFixed(2) || "",
            record.fileA?.tax?.toFixed(2) || "",
            record.fileB?.tax?.toFixed(2) || "",
        ];

        if (includeVariance) {
            row.push(
                record.variance?.amount?.toFixed(2) || "0.00",
                record.variance?.tax?.toFixed(2) || "0.00"
            );
        }

        if (includeDetails) {
            const differences =
                record.differences
                    ?.map((d) => `${d.field}: ${d.valueA} → ${d.valueB}`)
                    .join("; ") || "None";
            const status = getRecordStatus(record);
            row.push(differences, status);
        }

        return row;
    });

    // Create CSV content
    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
    ].join("\n");

    // Create and trigger download
    downloadFile(csvContent, filename, "text/csv");
};

/**
 * Export summary statistics to CSV
 * @param {Object} summary - Summary statistics
 * @param {string} filename - Name of the file to download
 */
export const exportSummaryToCSV = (summary, filename = "reconciliation_summary.csv") => {
    const rows = [
        ["Metric", "Value"],
        ["Total Records", summary.totalRecords],
        ["Matched Records", summary.matchedCount],
        ["Matched Percentage", `${summary.matchedPercentage}%`],
        ["Partial Matches", summary.partialCount],
        ["Partial Percentage", `${summary.partialPercentage}%`],
        ["Unmatched in File A", summary.unmatchedACount],
        ["Unmatched in File B", summary.unmatchedBCount],
        ["Total Amount Variance", `$${summary.totalVariance.amount.toFixed(2)}`],
        ["Total Tax Variance", `$${summary.totalVariance.tax.toFixed(2)}`],
    ];

    const csvContent = rows
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    downloadFile(csvContent, filename, "text/csv");
};

/**
 * Export insights to CSV
 * @param {Object} insights - Generated insights
 * @param {string} filename - Name of the file to download
 */
export const exportInsightsToCSV = (insights, filename = "reconciliation_insights.csv") => {
    const sections = [];

    // Top Mismatched Parties
    sections.push(["TOP MISMATCHED PARTIES"]);
    sections.push(["Party", "Mismatch Count", "Total Variance", "Partial", "Unmatched A", "Unmatched B"]);
    insights.topMismatchedParties.forEach((party) => {
        sections.push([
            party.party,
            party.mismatchCount,
            `$${party.totalAmountVariance}`,
            party.breakdown.partial,
            party.breakdown.unmatchedA,
            party.breakdown.unmatchedB,
        ]);
    });
    sections.push([]);

    // Problematic Fields
    sections.push(["PROBLEMATIC FIELDS"]);
    sections.push(["Field", "Discrepancy Count"]);
    Object.entries(insights.problematicFields.fieldCounts).forEach(([field, count]) => {
        sections.push([field.toUpperCase(), count]);
    });
    sections.push(["Most Problematic", insights.problematicFields.mostProblematic.toUpperCase()]);
    sections.push([]);

    // Variance Analysis
    sections.push(["VARIANCE ANALYSIS"]);
    sections.push(["Metric", "Amount", "Tax"]);
    sections.push([
        "Total Variance",
        `$${insights.varianceAnalysis.totalVariance.amount}`,
        `$${insights.varianceAnalysis.totalVariance.tax}`,
    ]);
    sections.push([
        "Average Variance",
        `$${insights.varianceAnalysis.averageVariance.amount}`,
        `$${insights.varianceAnalysis.averageVariance.tax}`,
    ]);
    sections.push([]);

    // Recommendations
    sections.push(["RECOMMENDATIONS"]);
    sections.push(["Priority", "Category", "Message", "Action"]);
    insights.recommendations.forEach((rec) => {
        sections.push([rec.priority.toUpperCase(), rec.category, rec.message, rec.action]);
    });

    const csvContent = sections
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    downloadFile(csvContent, filename, "text/csv");
};

/**
 * Export complete reconciliation report (all data + summary + insights)
 * @param {Object} results - Reconciliation results
 * @param {Object} summary - Summary statistics
 * @param {Object} insights - Generated insights
 * @param {string} filename - Name of the file to download
 */
export const exportCompleteReport = (results, summary, insights, filename = "complete_reconciliation_report.csv") => {
    const sections = [];

    // Header
    sections.push(["RECONCILIATION REPORT"]);
    sections.push(["Generated:", new Date().toLocaleString()]);
    sections.push([]);

    // Summary Section
    sections.push(["SUMMARY STATISTICS"]);
    sections.push(["Total Records", summary.totalRecords]);
    sections.push(["Matched", `${summary.matchedCount} (${summary.matchedPercentage}%)`]);
    sections.push(["Partial Matches", `${summary.partialCount} (${summary.partialPercentage}%)`]);
    sections.push(["Unmatched in File A", summary.unmatchedACount]);
    sections.push(["Unmatched in File B", summary.unmatchedBCount]);
    sections.push(["Total Variance", `$${summary.totalVariance.amount.toFixed(2)}`]);
    sections.push([]);

    // Matched Records
    if (results.matched.length > 0) {
        sections.push(["MATCHED RECORDS"]);
        sections.push(["Doc No", "Party", "Date", "Amount"]);
        results.matched.slice(0, 10).forEach((record) => {
            sections.push([
                record.docNo,
                record.fileA.party,
                record.fileA.date,
                `$${record.fileA.amount.toFixed(2)}`,
            ]);
        });
        if (results.matched.length > 10) {
            sections.push([`... and ${results.matched.length - 10} more`]);
        }
        sections.push([]);
    }

    // Partial Matches
    if (results.partial.length > 0) {
        sections.push(["PARTIAL MATCHES (TOP 10)"]);
        sections.push(["Doc No", "Party (A)", "Party (B)", "Amount (A)", "Amount (B)", "Variance", "Differences"]);
        results.partial.slice(0, 10).forEach((record) => {
            const diffs = record.differences.map((d) => d.field).join(", ");
            sections.push([
                record.docNo,
                record.fileA.party,
                record.fileB.party,
                `$${record.fileA.amount.toFixed(2)}`,
                `$${record.fileB.amount.toFixed(2)}`,
                `$${record.variance.amount.toFixed(2)}`,
                diffs,
            ]);
        });
        sections.push([]);
    }

    // Top Recommendations
    sections.push(["TOP RECOMMENDATIONS"]);
    sections.push(["Priority", "Message", "Action"]);
    insights.recommendations.slice(0, 5).forEach((rec) => {
        sections.push([rec.priority.toUpperCase(), rec.message, rec.action]);
    });

    const csvContent = sections
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    downloadFile(csvContent, filename, "text/csv");
};

/**
 * Helper function to get record status description
 * @param {Object} record - Reconciliation record
 * @returns {string} Status description
 */
const getRecordStatus = (record) => {
    switch (record.type) {
        case "matched":
            return "Perfect Match";
        case "partial":
            return `Mismatch in: ${record.differences.map((d) => d.field).join(", ")}`;
        case "unmatchedA":
            return "Only in File A";
        case "unmatchedB":
            return "Only in File B";
        default:
            return "Unknown";
    }
};

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Export data to JSON format
 * @param {Object} data - Data to export
 * @param {string} filename - Name of the file to download
 */
export const exportToJSON = (data, filename = "reconciliation_results.json") => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, "application/json");
};

