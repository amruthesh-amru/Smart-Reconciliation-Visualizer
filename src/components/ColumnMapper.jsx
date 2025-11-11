import React, { useEffect, useState } from "react";
import { FiCheck, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { autoDetectColumns } from "../utils/csvParser";
import useReconciliationStore from "../store/reconciliationStore";

const ColumnMapper = ({ onNext, onBack }) => {
  const {
    filesData,
    columnMapping,
    setColumnMapping,
    runReconciliation,
    error: storeError,
  } = useReconciliationStore();

  const [localMapping, setLocalMapping] = useState(columnMapping);
  const [validationErrors, setValidationErrors] = useState({});
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    // Auto-detect columns on component mount
    if (filesData.fileA && filesData.fileB && !autoDetected) {
      const mappingA = autoDetectColumns(filesData.fileA.headers);
      const mappingB = autoDetectColumns(filesData.fileB.headers);

      setLocalMapping({
        fileA: mappingA,
        fileB: mappingB,
      });

      setColumnMapping("fileA", mappingA);
      setColumnMapping("fileB", mappingB);
      setAutoDetected(true);
    }
  }, [filesData, autoDetected, setColumnMapping]);

  const handleMappingChange = (fileKey, field, value) => {
    setLocalMapping((prev) => ({
      ...prev,
      [fileKey]: {
        ...prev[fileKey],
        [field]: value,
      },
    }));

    setColumnMapping(fileKey, {
      ...localMapping[fileKey],
      [field]: value,
    });

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${fileKey}.${field}`];
      return newErrors;
    });
  };

  const validateMapping = () => {
    const errors = {};
    const requiredFields = ["docNo", "party", "date", "amount"];

    ["fileA", "fileB"].forEach((fileKey) => {
      requiredFields.forEach((field) => {
        if (!localMapping[fileKey][field]) {
          errors[`${fileKey}.${field}`] = "This field is required";
        }
      });
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateMapping()) {
      const success = runReconciliation();
      if (success && onNext) {
        onNext();
      }
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const requiredFields = [
    { key: "docNo", label: "Document Number", required: true },
    { key: "party", label: "Party/Vendor Name", required: true },
    { key: "date", label: "Date", required: true },
    { key: "amount", label: "Amount", required: true },
    { key: "tax", label: "Tax/VAT", required: false },
  ];

  if (!filesData.fileA || !filesData.fileB) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-500">
          Please upload both files first.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Map Your Columns
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Match your file columns to the required fields for reconciliation
        </p>
      </div>

      {/* Auto-detect info */}
      {autoDetected && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <FiCheck className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-blue-900 font-medium">Columns auto-detected!</p>
            <p className="text-blue-700 text-sm">
              We've automatically matched your columns. Please review and adjust
              if needed.
            </p>
          </div>
        </div>
      )}

      {/* Store error */}
      {storeError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <FiAlertCircle className="text-red-600 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-900 font-medium">Error</p>
            <p className="text-red-700 text-sm">{storeError}</p>
          </div>
        </div>
      )}

      {/* Mapping Tables */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* File A Mapping */}
        <MappingTable
          title="File A"
          fileName={filesData.fileA.name}
          headers={filesData.fileA.headers}
          mapping={localMapping.fileA}
          requiredFields={requiredFields}
          validationErrors={validationErrors}
          fileKey="fileA"
          onMappingChange={handleMappingChange}
        />

        {/* File B Mapping */}
        <MappingTable
          title="File B"
          fileName={filesData.fileB.name}
          headers={filesData.fileB.headers}
          mapping={localMapping.fileB}
          requiredFields={requiredFields}
          validationErrors={validationErrors}
          fileKey="fileB"
          onMappingChange={handleMappingChange}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-center">
        <button
          onClick={handleBack}
          className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
        >
          Run Reconciliation
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Mapping Table Component
const MappingTable = ({
  title,
  fileName,
  headers,
  mapping,
  requiredFields,
  validationErrors,
  fileKey,
  onMappingChange,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{fileName}</p>
      </div>

      <div className="space-y-4">
        {requiredFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={mapping[field.key] || ""}
              onChange={(e) =>
                onMappingChange(fileKey, field.key, e.target.value || null)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors[`${fileKey}.${field.key}`]
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">-- Select Column --</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
            {validationErrors[`${fileKey}.${field.key}`] && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors[`${fileKey}.${field.key}`]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mapping Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Mapping Summary
        </h4>
        <div className="space-y-1">
          {requiredFields.map((field) => {
            const mapped = mapping[field.key];
            return (
              <div key={field.key} className="flex justify-between text-sm">
                <span className="text-gray-600">{field.label}:</span>
                <span
                  className={
                    mapped ? "text-green-600 font-medium" : "text-gray-400"
                  }
                >
                  {mapped ? (
                    <span className="flex items-center">
                      <FiCheck className="mr-1" /> {mapped}
                    </span>
                  ) : (
                    "Not mapped"
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColumnMapper;
