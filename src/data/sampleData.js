/**
 * Sample data for demo mode
 * Contains realistic examples of matched, partial, and unmatched records
 */

// File A - Sample vendor invoices
const fileAData = [
    // Perfect matches
    { InvoiceNo: "INV001", VendorName: "Acme Corp", Date: "2024-01-15", Amount: "1000.00", Tax: "180.00" },
    { InvoiceNo: "INV002", VendorName: "TechSupplies Inc", Date: "2024-01-16", Amount: "2500.50", Tax: "450.09" },
    { InvoiceNo: "INV003", VendorName: "Office Solutions", Date: "2024-01-17", Amount: "750.25", Tax: "135.05" },
    { InvoiceNo: "INV004", VendorName: "Global Logistics", Date: "2024-01-18", Amount: "3200.00", Tax: "576.00" },
    { InvoiceNo: "INV005", VendorName: "DataCom Systems", Date: "2024-01-19", Amount: "1500.00", Tax: "270.00" },

    // Amount variances (within tolerance)
    { InvoiceNo: "INV006", VendorName: "Print Masters", Date: "2024-01-20", Amount: "980.00", Tax: "176.40" },
    { InvoiceNo: "INV007", VendorName: "Cloud Services Ltd", Date: "2024-01-21", Amount: "5000.00", Tax: "900.00" },

    // Amount variances (outside tolerance)
    { InvoiceNo: "INV008", VendorName: "Marketing Plus", Date: "2024-01-22", Amount: "1200.00", Tax: "216.00" },
    { InvoiceNo: "INV009", VendorName: "Consulting Group", Date: "2024-01-23", Amount: "4000.00", Tax: "720.00" },

    // Date differences
    { InvoiceNo: "INV010", VendorName: "Equipment Rental", Date: "2024-01-24", Amount: "800.00", Tax: "144.00" },
    { InvoiceNo: "INV011", VendorName: "Software Solutions", Date: "2024-01-25", Amount: "6500.00", Tax: "1170.00" },

    // Party name variations (case/spacing)
    { InvoiceNo: "INV012", VendorName: "Premier Services", Date: "2024-01-26", Amount: "950.00", Tax: "171.00" },
    { InvoiceNo: "INV013", VendorName: "GLOBAL TECH", Date: "2024-01-27", Amount: "2100.00", Tax: "378.00" },
    { InvoiceNo: "INV014", VendorName: "Metro Supplies", Date: "2024-01-28", Amount: "1350.00", Tax: "243.00" },

    // Only in File A
    { InvoiceNo: "INV015", VendorName: "Local Vendor A", Date: "2024-01-29", Amount: "550.00", Tax: "99.00" },
    { InvoiceNo: "INV016", VendorName: "Regional Corp", Date: "2024-01-30", Amount: "780.00", Tax: "140.40" },
    { InvoiceNo: "INV017", VendorName: "City Services", Date: "2024-01-31", Amount: "1100.00", Tax: "198.00" },
    { InvoiceNo: "INV018", VendorName: "Downtown Supplies", Date: "2024-02-01", Amount: "920.00", Tax: "165.60" },
    { InvoiceNo: "INV019", VendorName: "Express Delivery", Date: "2024-02-02", Amount: "450.00", Tax: "81.00" },

    // More perfect matches
    { InvoiceNo: "INV020", VendorName: "Alpha Industries", Date: "2024-02-03", Amount: "2800.00", Tax: "504.00" },
    { InvoiceNo: "INV021", VendorName: "Beta Corporation", Date: "2024-02-04", Amount: "1650.00", Tax: "297.00" },
    { InvoiceNo: "INV022", VendorName: "Gamma Solutions", Date: "2024-02-05", Amount: "3300.00", Tax: "594.00" },
    { InvoiceNo: "INV023", VendorName: "Delta Logistics", Date: "2024-02-06", Amount: "1950.00", Tax: "351.00" },

    // Multiple field differences
    { InvoiceNo: "INV024", VendorName: "Epsilon Tech", Date: "2024-02-07", Amount: "2200.00", Tax: "396.00" },
    { InvoiceNo: "INV025", VendorName: "Zeta Services", Date: "2024-02-08", Amount: "1400.00", Tax: "252.00" },

    // More unmatched
    { InvoiceNo: "INV026", VendorName: "Theta Corp", Date: "2024-02-09", Amount: "890.00", Tax: "160.20" },
    { InvoiceNo: "INV027", VendorName: "Iota Systems", Date: "2024-02-10", Amount: "1750.00", Tax: "315.00" },
    { InvoiceNo: "INV028", VendorName: "Kappa Industries", Date: "2024-02-11", Amount: "3100.00", Tax: "558.00" },

    // Amount variances with different patterns
    { InvoiceNo: "INV029", VendorName: "Lambda Solutions", Date: "2024-02-12", Amount: "1580.00", Tax: "284.40" },
    { InvoiceNo: "INV030", VendorName: "Mu Enterprises", Date: "2024-02-13", Amount: "2450.00", Tax: "441.00" },
    { InvoiceNo: "INV031", VendorName: "Nu Corporation", Date: "2024-02-14", Amount: "1820.00", Tax: "327.60" },

    // Perfect matches
    { InvoiceNo: "INV032", VendorName: "Xi Technologies", Date: "2024-02-15", Amount: "4100.00", Tax: "738.00" },
    { InvoiceNo: "INV033", VendorName: "Omicron Inc", Date: "2024-02-16", Amount: "990.00", Tax: "178.20" },
    { InvoiceNo: "INV034", VendorName: "Pi Logistics", Date: "2024-02-17", Amount: "2650.00", Tax: "477.00" },

    // Date and amount variance
    { InvoiceNo: "INV035", VendorName: "Rho Services", Date: "2024-02-18", Amount: "1370.00", Tax: "246.60" },
    { InvoiceNo: "INV036", VendorName: "Sigma Group", Date: "2024-02-19", Amount: "5500.00", Tax: "990.00" },

    // More unmatched in A
    { InvoiceNo: "INV037", VendorName: "Tau Industries", Date: "2024-02-20", Amount: "720.00", Tax: "129.60" },
    { InvoiceNo: "INV038", VendorName: "Upsilon Corp", Date: "2024-02-21", Amount: "1290.00", Tax: "232.20" },
    { InvoiceNo: "INV039", VendorName: "Phi Systems", Date: "2024-02-22", Amount: "2980.00", Tax: "536.40" },
    { InvoiceNo: "INV040", VendorName: "Chi Enterprises", Date: "2024-02-23", Amount: "1840.00", Tax: "331.20" },
];

// File B - Sample payment records
const fileBData = [
    // Perfect matches (same as File A)
    { DocumentNo: "INV001", Supplier: "Acme Corp", TransactionDate: "2024-01-15", Total: "1000.00", VAT: "180.00" },
    { DocumentNo: "INV002", Supplier: "TechSupplies Inc", TransactionDate: "2024-01-16", Total: "2500.50", VAT: "450.09" },
    { DocumentNo: "INV003", Supplier: "Office Solutions", TransactionDate: "2024-01-17", Total: "750.25", VAT: "135.05" },
    { DocumentNo: "INV004", Supplier: "Global Logistics", TransactionDate: "2024-01-18", Total: "3200.00", VAT: "576.00" },
    { DocumentNo: "INV005", Supplier: "DataCom Systems", TransactionDate: "2024-01-19", Total: "1500.00", VAT: "270.00" },

    // Amount variances (within tolerance) - small differences
    { DocumentNo: "INV006", Supplier: "Print Masters", TransactionDate: "2024-01-20", Total: "1020.00", VAT: "183.60" },
    { DocumentNo: "INV007", Supplier: "Cloud Services Ltd", TransactionDate: "2024-01-21", Total: "5100.00", VAT: "918.00" },

    // Amount variances (outside tolerance) - larger differences
    { DocumentNo: "INV008", Supplier: "Marketing Plus", TransactionDate: "2024-01-22", Total: "1450.00", VAT: "261.00" },
    { DocumentNo: "INV009", Supplier: "Consulting Group", TransactionDate: "2024-01-23", Total: "4500.00", VAT: "810.00" },

    // Date differences (within tolerance)
    { DocumentNo: "INV010", Supplier: "Equipment Rental", TransactionDate: "2024-01-26", Total: "800.00", VAT: "144.00" },
    { DocumentNo: "INV011", Supplier: "Software Solutions", TransactionDate: "2024-01-30", Total: "6500.00", VAT: "1170.00" },

    // Party name variations (different case/format)
    { DocumentNo: "INV012", Supplier: "PREMIER SERVICES", TransactionDate: "2024-01-26", Total: "950.00", VAT: "171.00" },
    { DocumentNo: "INV013", Supplier: "Global Tech", TransactionDate: "2024-01-27", Total: "2100.00", VAT: "378.00" },
    { DocumentNo: "INV014", Supplier: "Metro Supplies Co", TransactionDate: "2024-01-28", Total: "1350.00", VAT: "243.00" },

    // Only in File B
    { DocumentNo: "INV041", Supplier: "New Vendor B", TransactionDate: "2024-02-24", Total: "1560.00", VAT: "280.80" },
    { DocumentNo: "INV042", Supplier: "Another Supplier", TransactionDate: "2024-02-25", Total: "2340.00", VAT: "421.20" },
    { DocumentNo: "INV043", Supplier: "Extra Services", TransactionDate: "2024-02-26", Total: "890.00", VAT: "160.20" },
    { DocumentNo: "INV044", Supplier: "Additional Corp", TransactionDate: "2024-02-27", Total: "1670.00", VAT: "300.60" },
    { DocumentNo: "INV045", Supplier: "Bonus Supplier", TransactionDate: "2024-02-28", Total: "2190.00", VAT: "394.20" },

    // Perfect matches
    { DocumentNo: "INV020", Supplier: "Alpha Industries", TransactionDate: "2024-02-03", Total: "2800.00", VAT: "504.00" },
    { DocumentNo: "INV021", Supplier: "Beta Corporation", TransactionDate: "2024-02-04", Total: "1650.00", VAT: "297.00" },
    { DocumentNo: "INV022", Supplier: "Gamma Solutions", TransactionDate: "2024-02-05", Total: "3300.00", VAT: "594.00" },
    { DocumentNo: "INV023", Supplier: "Delta Logistics", TransactionDate: "2024-02-06", Total: "1950.00", VAT: "351.00" },

    // Multiple field differences
    { DocumentNo: "INV024", Supplier: "Epsilon Technologies", TransactionDate: "2024-02-10", Total: "2400.00", VAT: "432.00" },
    { DocumentNo: "INV025", Supplier: "Zeta Professional Services", TransactionDate: "2024-02-07", Total: "1500.00", VAT: "270.00" },

    // Amount variance
    { DocumentNo: "INV029", Supplier: "Lambda Solutions", TransactionDate: "2024-02-12", Total: "1620.00", VAT: "291.60" },
    { DocumentNo: "INV030", Supplier: "Mu Enterprises", TransactionDate: "2024-02-13", Total: "2550.00", VAT: "459.00" },
    { DocumentNo: "INV031", Supplier: "Nu Corporation", TransactionDate: "2024-02-14", Total: "1780.00", VAT: "320.40" },

    // Perfect matches
    { DocumentNo: "INV032", Supplier: "Xi Technologies", TransactionDate: "2024-02-15", Total: "4100.00", VAT: "738.00" },
    { DocumentNo: "INV033", Supplier: "Omicron Inc", TransactionDate: "2024-02-16", Total: "990.00", VAT: "178.20" },
    { DocumentNo: "INV034", Supplier: "Pi Logistics", TransactionDate: "2024-02-17", Total: "2650.00", VAT: "477.00" },

    // Date and amount variance
    { DocumentNo: "INV035", Supplier: "Rho Services", TransactionDate: "2024-02-15", Total: "1420.00", VAT: "255.60" },
    { DocumentNo: "INV036", Supplier: "Sigma Group", TransactionDate: "2024-02-20", Total: "5600.00", VAT: "1008.00" },

    // More only in B
    { DocumentNo: "INV046", Supplier: "Extra Corp", TransactionDate: "2024-03-01", Total: "1345.00", VAT: "242.10" },
    { DocumentNo: "INV047", Supplier: "Special Vendor", TransactionDate: "2024-03-02", Total: "2870.00", VAT: "516.60" },
    { DocumentNo: "INV048", Supplier: "Ultimate Supplies", TransactionDate: "2024-03-03", Total: "1590.00", VAT: "286.20" },
];

// Pre-configured column mapping for demo data
const demoColumnMapping = {
    fileA: {
        docNo: "InvoiceNo",
        party: "VendorName",
        date: "Date",
        amount: "Amount",
        tax: "Tax",
    },
    fileB: {
        docNo: "DocumentNo",
        party: "Supplier",
        date: "TransactionDate",
        amount: "Total",
        tax: "VAT",
    },
};

// Export demo data package
export const getDemoData = () => {
    return {
        fileA: {
            data: fileAData,
            headers: ["InvoiceNo", "VendorName", "Date", "Amount", "Tax"],
            name: "sample_invoices_A.csv",
        },
        fileB: {
            data: fileBData,
            headers: ["DocumentNo", "Supplier", "TransactionDate", "Total", "VAT"],
            name: "sample_payments_B.csv",
        },
        columnMapping: demoColumnMapping,
    };
};

export default {
    fileAData,
    fileBData,
    demoColumnMapping,
    getDemoData,
};

