import React, { useState } from "react";
import { FiSettings, FiRefreshCw } from "react-icons/fi";
import useReconciliationStore from "../store/reconciliationStore";

const SettingsPanel = () => {
  const { config, setConfig, reRunReconciliation, loading } =
    useReconciliationStore();

  const [localConfig, setLocalConfig] = useState(config);
  const [isOpen, setIsOpen] = useState(false);

  const handleAmountToleranceChange = (value) => {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 20) {
      setLocalConfig((prev) => ({ ...prev, amountTolerance: numValue }));
    }
  };

  const handleDateToleranceChange = (value) => {
    const numValue = parseInt(value);
    if (numValue >= 0 && numValue <= 30) {
      setLocalConfig((prev) => ({ ...prev, dateTolerance: numValue }));
    }
  };

  const handleApply = () => {
    setConfig(localConfig);
    reRunReconciliation();
  };

  const handleReset = () => {
    const defaultConfig = { amountTolerance: 5, dateTolerance: 3 };
    setLocalConfig(defaultConfig);
    setConfig(defaultConfig);
    reRunReconciliation();
  };

  const hasChanges =
    localConfig.amountTolerance !== config.amountTolerance ||
    localConfig.dateTolerance !== config.dateTolerance;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <FiSettings className="text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Reconciliation Settings
          </h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Settings Content */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          {/* Amount Tolerance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Amount Tolerance
              </label>
              <span className="text-sm font-semibold text-blue-600">
                ±{localConfig.amountTolerance}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={localConfig.amountTolerance}
              onChange={(e) => handleAmountToleranceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Amounts within ±{localConfig.amountTolerance}% will be considered
              as matched
            </p>
          </div>

          {/* Date Tolerance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Date Tolerance
              </label>
              <span className="text-sm font-semibold text-blue-600">
                ±{localConfig.dateTolerance} days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={localConfig.dateTolerance}
              onChange={(e) => handleDateToleranceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 days</span>
              <span>15 days</span>
              <span>30 days</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Dates within ±{localConfig.dateTolerance} days will be considered
              as matched
            </p>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Tolerance (%)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={localConfig.amountTolerance}
                onChange={(e) => handleAmountToleranceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Tolerance (days)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="1"
                value={localConfig.dateTolerance}
                onChange={(e) => handleDateToleranceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={!hasChanges || loading}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                hasChanges && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Applying...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Apply Changes
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
            >
              Reset to Default
            </button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> Changing these settings will re-run the
              reconciliation process with the new tolerance values.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
