import { create } from "zustand";
import { reconcileData, calculateSummary } from "../utils/reconciliationEngine";
import { generateInsights } from "../utils/insights";
import { normalizeData, validateData } from "../utils/csvParser";

/**
 * Reconciliation Store using Zustand
 * Manages all state for the reconciliation workflow
 */
const useReconciliationStore = create((set, get) => ({
    // ===== STATE =====

    // Current step in the workflow
    currentStep: "upload", // 'upload', 'mapping', 'results'

    // File data
    filesData: {
        fileA: null, // { data: [], headers: [], name: '' }
        fileB: null, // { data: [], headers: [], name: '' }
    },

    // Column mapping configuration
    columnMapping: {
        fileA: {
            docNo: null,
            party: null,
            date: null,
            amount: null,
            tax: null,
        },
        fileB: {
            docNo: null,
            party: null,
            date: null,
            amount: null,
            tax: null,
        },
    },

    // Reconciliation configuration
    config: {
        amountTolerance: 5, // Percentage (0-20)
        dateTolerance: 3, // Days (0-30)
    },

    // Normalized data (after column mapping)
    normalizedData: {
        fileA: [],
        fileB: [],
    },

    // Reconciliation results
    reconciliationResults: {
        matched: [],
        partial: [],
        unmatchedA: [],
        unmatchedB: [],
    },

    // Summary statistics
    summary: null,

    // Generated insights
    insights: null,

    // Filters for results display
    filters: {
        type: "all", // 'all', 'matched', 'partial', 'unmatchedA', 'unmatchedB'
        searchTerm: "",
        party: "",
        minAmount: null,
        maxAmount: null,
    },

    // UI state
    loading: false,
    error: null,

    // ===== ACTIONS =====

    /**
     * Set file data
     */
    setFile: (fileKey, fileData) => {
        set((state) => ({
            filesData: {
                ...state.filesData,
                [fileKey]: fileData,
            },
            error: null,
        }));
    },

    /**
     * Set column mapping for a file
     */
    setColumnMapping: (fileKey, mapping) => {
        set((state) => ({
            columnMapping: {
                ...state.columnMapping,
                [fileKey]: mapping,
            },
        }));
    },

    /**
     * Set reconciliation configuration
     */
    setConfig: (config) => {
        set((state) => ({
            config: {
                ...state.config,
                ...config,
            },
        }));
    },

    /**
     * Set current workflow step
     */
    setStep: (step) => {
        set({ currentStep: step });
    },

    /**
     * Validate and normalize data before reconciliation
     */
    prepareData: () => {
        const state = get();
        const { filesData, columnMapping } = state;

        try {
            // Validate both files have data
            if (!filesData.fileA || !filesData.fileB) {
                throw new Error("Both files must be uploaded");
            }

            // Validate column mappings
            if (
                !validateData(filesData.fileA.data, columnMapping.fileA) ||
                !validateData(filesData.fileB.data, columnMapping.fileB)
            ) {
                throw new Error("Invalid column mapping. Please map all required fields.");
            }

            // Normalize data
            const normalizedA = normalizeData(
                filesData.fileA.data,
                columnMapping.fileA
            );
            const normalizedB = normalizeData(
                filesData.fileB.data,
                columnMapping.fileB
            );

            set({
                normalizedData: {
                    fileA: normalizedA,
                    fileB: normalizedB,
                },
                error: null,
            });

            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    },

    /**
     * Run reconciliation process
     */
    runReconciliation: () => {
        const state = get();
        set({ loading: true, error: null });

        try {
            // Prepare and validate data first
            const isReady = state.prepareData();
            if (!isReady) {
                set({ loading: false });
                return false;
            }

            const { normalizedData, config } = get();

            // Run reconciliation
            const results = reconcileData(
                normalizedData.fileA,
                normalizedData.fileB,
                config
            );

            // Calculate summary
            const summary = calculateSummary(results);

            // Generate insights
            const insights = generateInsights(
                results,
                normalizedData.fileA,
                normalizedData.fileB
            );

            set({
                reconciliationResults: results,
                summary,
                insights,
                loading: false,
                currentStep: "results",
            });

            return true;
        } catch (error) {
            set({
                loading: false,
                error: error.message || "Reconciliation failed",
            });
            return false;
        }
    },

    /**
     * Re-run reconciliation with updated config (for settings changes)
     */
    reRunReconciliation: () => {
        const state = get();
        set({ loading: true, error: null });

        try {
            const { normalizedData, config } = state;

            // Run reconciliation with new config
            const results = reconcileData(
                normalizedData.fileA,
                normalizedData.fileB,
                config
            );

            // Calculate summary
            const summary = calculateSummary(results);

            // Generate insights
            const insights = generateInsights(
                results,
                normalizedData.fileA,
                normalizedData.fileB
            );

            set({
                reconciliationResults: results,
                summary,
                insights,
                loading: false,
            });

            return true;
        } catch (error) {
            set({
                loading: false,
                error: error.message || "Reconciliation failed",
            });
            return false;
        }
    },

    /**
     * Set display filters
     */
    setFilters: (filters) => {
        set((state) => ({
            filters: {
                ...state.filters,
                ...filters,
            },
        }));
    },

    /**
     * Get filtered results based on current filters
     */
    getFilteredResults: () => {
        const { reconciliationResults, filters } = get();

        let results = [];

        // Filter by type
        if (filters.type === "all") {
            results = [
                ...reconciliationResults.matched,
                ...reconciliationResults.partial,
                ...reconciliationResults.unmatchedA,
                ...reconciliationResults.unmatchedB,
            ];
        } else if (filters.type === "matched") {
            results = reconciliationResults.matched;
        } else if (filters.type === "partial") {
            results = reconciliationResults.partial;
        } else if (filters.type === "unmatchedA") {
            results = reconciliationResults.unmatchedA;
        } else if (filters.type === "unmatchedB") {
            results = reconciliationResults.unmatchedB;
        }

        // Filter by search term (document number or party)
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            results = results.filter((record) => {
                const docNo = record.docNo?.toLowerCase() || "";
                const partyA = record.fileA?.party?.toLowerCase() || "";
                const partyB = record.fileB?.party?.toLowerCase() || "";
                return (
                    docNo.includes(searchLower) ||
                    partyA.includes(searchLower) ||
                    partyB.includes(searchLower)
                );
            });
        }

        // Filter by party name
        if (filters.party) {
            const partyLower = filters.party.toLowerCase();
            results = results.filter((record) => {
                const partyA = record.fileA?.party?.toLowerCase() || "";
                const partyB = record.fileB?.party?.toLowerCase() || "";
                return partyA.includes(partyLower) || partyB.includes(partyLower);
            });
        }

        // Filter by amount range
        if (filters.minAmount !== null || filters.maxAmount !== null) {
            results = results.filter((record) => {
                const amount = record.fileA?.amount || record.fileB?.amount || 0;
                const min = filters.minAmount !== null ? filters.minAmount : -Infinity;
                const max = filters.maxAmount !== null ? filters.maxAmount : Infinity;
                return amount >= min && amount <= max;
            });
        }

        return results;
    },

    /**
     * Clear all filters
     */
    clearFilters: () => {
        set({
            filters: {
                type: "all",
                searchTerm: "",
                party: "",
                minAmount: null,
                maxAmount: null,
            },
        });
    },

    /**
     * Reset entire state (start over)
     */
    resetState: () => {
        set({
            currentStep: "upload",
            filesData: {
                fileA: null,
                fileB: null,
            },
            columnMapping: {
                fileA: {
                    docNo: null,
                    party: null,
                    date: null,
                    amount: null,
                    tax: null,
                },
                fileB: {
                    docNo: null,
                    party: null,
                    date: null,
                    amount: null,
                    tax: null,
                },
            },
            config: {
                amountTolerance: 5,
                dateTolerance: 3,
            },
            normalizedData: {
                fileA: [],
                fileB: [],
            },
            reconciliationResults: {
                matched: [],
                partial: [],
                unmatchedA: [],
                unmatchedB: [],
            },
            summary: null,
            insights: null,
            filters: {
                type: "all",
                searchTerm: "",
                party: "",
                minAmount: null,
                maxAmount: null,
            },
            loading: false,
            error: null,
        });
    },

    /**
     * Load demo data (for quick testing)
     */
    loadDemoData: (demoData) => {
        set({
            filesData: {
                fileA: demoData.fileA,
                fileB: demoData.fileB,
            },
            columnMapping: demoData.columnMapping,
            currentStep: "mapping",
            error: null,
        });
    },
}));

export default useReconciliationStore;

