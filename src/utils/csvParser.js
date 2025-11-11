import Papa from "papaparse";

/**
 * Parse CSV/JSON file and return normalized array of objects
 * @param {File} file - The file to parse
 * @returns {Promise<{data: Array, headers: Array, error: string|null}>}
 */
export const parseFile = (file) => {
    return new Promise((resolve) => {
        // Check if file is JSON
        if (file.name.endsWith(".json")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
                    const headers = dataArray.length > 0 ? Object.keys(dataArray[0]) : [];
                    resolve({ data: dataArray, headers, error: null });
                } catch (error) {
                    resolve({ data: [], headers: [], error: "Invalid JSON format" });
                }
            };
            reader.onerror = () => {
                resolve({ data: [], headers: [], error: "Failed to read file" });
            };
            reader.readAsText(file);
        } else {
            // Parse CSV file using PapaParse
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim(),
                complete: (results) => {
                    if (results.errors.length > 0) {
                        resolve({
                            data: [],
                            headers: [],
                            error: `CSV parsing error: ${results.errors[0].message}`,
                        });
                    } else {
                        const headers = results.meta.fields || [];
                        resolve({ data: results.data, headers, error: null });
                    }
                },
                error: (error) => {
                    resolve({ data: [], headers: [], error: error.message });
                },
            });
        }
    });
};

/**
 * Validate parsed data structure
 * @param {Array} data - The parsed data array
 * @param {Object} columnMapping - Column mapping configuration
 * @returns {boolean}
 */
export const validateData = (data, columnMapping) => {
    if (!data || data.length === 0) return false;
    if (!columnMapping || !columnMapping.docNo) return false;

    // Check if mapped columns exist in data
    const firstRow = data[0];
    const requiredFields = ["docNo", "party", "date", "amount"];

    for (const field of requiredFields) {
        const mappedColumn = columnMapping[field];
        if (!mappedColumn || !(mappedColumn in firstRow)) {
            return false;
        }
    }

    return true;
};

/**
 * Normalize data using column mapping
 * @param {Array} data - The parsed data array
 * @param {Object} columnMapping - Column mapping configuration
 * @returns {Array} Normalized data with standard field names
 */
export const normalizeData = (data, columnMapping) => {
    return data.map((row, index) => {
        const normalized = {
            _rowIndex: index,
            docNo: row[columnMapping.docNo] || "",
            party: row[columnMapping.party] || "",
            date: row[columnMapping.date] || "",
            amount: parseFloat(row[columnMapping.amount]) || 0,
            tax: columnMapping.tax ? parseFloat(row[columnMapping.tax]) || 0 : 0,
            _raw: row, // Keep original data for reference
        };

        // Clean up string values
        normalized.docNo = normalized.docNo.toString().trim();
        normalized.party = normalized.party.toString().trim();
        normalized.date = normalized.date.toString().trim();

        return normalized;
    });
};

/**
 * Auto-detect column mapping based on common column names
 * @param {Array} headers - Array of column headers
 * @returns {Object} Suggested column mapping
 */
export const autoDetectColumns = (headers) => {
    const mapping = {
        docNo: null,
        party: null,
        date: null,
        amount: null,
        tax: null,
    };

    const headerLower = headers.map((h) => h.toLowerCase());

    // Document number variations
    const docNoPatterns = [
        "docno",
        "doc_no",
        "document",
        "invoice",
        "invoiceno",
        "invoice_no",
        "invoice number",
        "reference",
        "ref",
        "transaction_id",
        "id",
    ];
    mapping.docNo = findMatchingHeader(headerLower, headers, docNoPatterns);

    // Party/Vendor variations
    const partyPatterns = [
        "party",
        "vendor",
        "customer",
        "supplier",
        "company",
        "name",
        "vendorname",
        "vendor_name",
        "customername",
        "customer_name",
    ];
    mapping.party = findMatchingHeader(headerLower, headers, partyPatterns);

    // Date variations
    const datePatterns = [
        "date",
        "transaction_date",
        "invoice_date",
        "invoicedate",
        "created",
        "timestamp",
    ];
    mapping.date = findMatchingHeader(headerLower, headers, datePatterns);

    // Amount variations
    const amountPatterns = [
        "amount",
        "total",
        "value",
        "price",
        "sum",
        "net_amount",
        "netamount",
        "gross_amount",
        "grossamount",
    ];
    mapping.amount = findMatchingHeader(headerLower, headers, amountPatterns);

    // Tax variations
    const taxPatterns = [
        "tax",
        "vat",
        "gst",
        "tax_amount",
        "taxamount",
        "vat_amount",
        "vatamount",
    ];
    mapping.tax = findMatchingHeader(headerLower, headers, taxPatterns);

    return mapping;
};

/**
 * Helper function to find matching header
 * @param {Array} headerLower - Lowercase headers
 * @param {Array} headers - Original headers
 * @param {Array} patterns - Patterns to match
 * @returns {string|null} Matched header or null
 */
const findMatchingHeader = (headerLower, headers, patterns) => {
    for (const pattern of patterns) {
        const index = headerLower.findIndex(
            (h) => h.includes(pattern) || pattern.includes(h)
        );
        if (index !== -1) {
            return headers[index];
        }
    }
    return null;
};

/**
 * Preview first N rows of data
 * @param {Array} data - The data array
 * @param {number} rows - Number of rows to preview (default: 5)
 * @returns {Array} Preview data
 */
export const previewData = (data, rows = 5) => {
    return data.slice(0, rows);
};

