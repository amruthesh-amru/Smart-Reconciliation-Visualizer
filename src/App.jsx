import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import useReconciliationStore from "./store/reconciliationStore";
import FileUpload from "./components/FileUpload";
import ColumnMapper from "./components/ColumnMapper";
import Dashboard from "./components/Dashboard";
import SettingsPanel from "./components/SettingsPanel";
import ResultsTable from "./components/ResultsTable";
import InsightsPanel from "./components/InsightsPanel";

function App() {
  const { currentStep, resetState, loading, error } = useReconciliationStore();

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to start over? All data will be cleared."
      )
    ) {
      resetState();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Smart Reconciliation Visualizer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Intelligent data reconciliation with automated insights
              </p>
            </div>
            {currentStep !== "upload" && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex items-center px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                <FiRefreshCw className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Start Over</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-lg font-medium text-gray-900">
                Processing reconciliation...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a moment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center px-4">
            <StepIndicator
              step={1}
              label="Upload Files"
              active={currentStep === "upload"}
              completed={currentStep === "mapping" || currentStep === "results"}
            />
            <div className="w-8 sm:w-12 md:w-24 h-1 bg-gray-300 mx-1 sm:mx-2">
              <div
                className={`h-full transition-all ${
                  currentStep === "mapping" || currentStep === "results"
                    ? "bg-blue-600 w-full"
                    : "bg-gray-300 w-0"
                }`}
              />
            </div>
            <StepIndicator
              step={2}
              label="Map Columns"
              active={currentStep === "mapping"}
              completed={currentStep === "results"}
            />
            <div className="w-8 sm:w-12 md:w-24 h-1 bg-gray-300 mx-1 sm:mx-2">
              <div
                className={`h-full transition-all ${
                  currentStep === "results"
                    ? "bg-blue-600 w-full"
                    : "bg-gray-300 w-0"
                }`}
              />
            </div>
            <StepIndicator
              step={3}
              label="View Results"
              active={currentStep === "results"}
              completed={false}
            />
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && <FileUpload />}

        {currentStep === "mapping" && (
          <ColumnMapper
            onBack={() => useReconciliationStore.getState().setStep("upload")}
          />
        )}

        {currentStep === "results" && (
          <div className="space-y-8">
            {/* Dashboard with Summary */}
            <Dashboard />

            {/* Settings Panel */}
            <SettingsPanel />

            {/* Results Table */}
            <ResultsTable />

            {/* Insights Panel */}
            <InsightsPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Smart Reconciliation Visualizer © 2024 | Built for WFYI Assignment
          </p>
        </div>
      </footer>
    </div>
  );
}

// Step Indicator Component
const StepIndicator = ({ step, label, active, completed }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-colors text-sm sm:text-base ${
          completed
            ? "bg-blue-600 text-white"
            : active
            ? "bg-blue-600 text-white ring-4 ring-blue-100"
            : "bg-gray-300 text-gray-600"
        }`}
      >
        {completed ? (
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          step
        )}
      </div>
      <p
        className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-center max-w-[80px] sm:max-w-none ${
          active ? "text-blue-600" : "text-gray-600"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export default App;
