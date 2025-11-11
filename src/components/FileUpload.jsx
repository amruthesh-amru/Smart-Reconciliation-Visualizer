import React, { useState } from "react";
import { FiUpload, FiFile, FiCheckCircle } from "react-icons/fi";
import { parseFile, previewData } from "../utils/csvParser";
import useReconciliationStore from "../store/reconciliationStore";
import { getDemoData } from "../data/sampleData";

const FileUpload = ({ onNext }) => {
  const { filesData, setFile, loadDemoData, setStep } =
    useReconciliationStore();
  const [uploading, setUploading] = useState({ fileA: false, fileB: false });
  const [errors, setErrors] = useState({ fileA: null, fileB: null });

  const handleFileUpload = async (event, fileKey) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [".csv", ".json"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));
    if (!validTypes.includes(fileExtension.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        [fileKey]: "Please upload a CSV or JSON file",
      }));
      return;
    }

    setUploading((prev) => ({ ...prev, [fileKey]: true }));
    setErrors((prev) => ({ ...prev, [fileKey]: null }));

    try {
      const result = await parseFile(file);

      if (result.error) {
        setErrors((prev) => ({ ...prev, [fileKey]: result.error }));
        setUploading((prev) => ({ ...prev, [fileKey]: false }));
        return;
      }

      setFile(fileKey, {
        data: result.data,
        headers: result.headers,
        name: file.name,
      });

      setUploading((prev) => ({ ...prev, [fileKey]: false }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [fileKey]: "Failed to parse file: " + error.message,
      }));
      setUploading((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  const handleLoadDemo = () => {
    const demoData = getDemoData();
    loadDemoData(demoData);
  };

  const handleNext = () => {
    if (filesData.fileA && filesData.fileB) {
      setStep("mapping");
      if (onNext) onNext();
    }
  };

  const canProceed = filesData.fileA && filesData.fileB;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Upload Files for Reconciliation
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Upload two CSV or JSON files to compare and reconcile data
        </p>
      </div>

      {/* Demo Mode Button */}
      <div className="text-center mb-6 sm:mb-8">
        <button
          onClick={handleLoadDemo}
          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
        >
          <FiFile className="mr-2" />
          Use Demo Data
        </button>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Try the application with pre-loaded sample data
        </p>
      </div>

      {/* Upload Zones */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* File A Upload */}
        <FileUploadZone
          title="File A"
          subtitle="Upload your first file (e.g., invoices)"
          fileKey="fileA"
          fileData={filesData.fileA}
          uploading={uploading.fileA}
          error={errors.fileA}
          onFileUpload={handleFileUpload}
        />

        {/* File B Upload */}
        <FileUploadZone
          title="File B"
          subtitle="Upload your second file (e.g., payments)"
          fileKey="fileB"
          fileData={filesData.fileB}
          uploading={uploading.fileB}
          error={errors.fileB}
          onFileUpload={handleFileUpload}
        />
      </div>

      {/* File Previews */}
      {(filesData.fileA || filesData.fileB) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filesData.fileA && (
            <FilePreview
              title="File A Preview"
              data={previewData(filesData.fileA.data)}
              headers={filesData.fileA.headers}
            />
          )}
          {filesData.fileB && (
            <FilePreview
              title="File B Preview"
              data={previewData(filesData.fileB.data)}
              headers={filesData.fileB.headers}
            />
          )}
        </div>
      )}

      {/* Next Button */}
      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-white transition-colors text-sm sm:text-base w-full sm:w-auto ${
            canProceed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Next: Map Columns
        </button>
      </div>
    </div>
  );
};

// Upload Zone Component
const FileUploadZone = ({
  title,
  subtitle,
  fileKey,
  fileData,
  uploading,
  error,
  onFileUpload,
}) => {
  const inputId = `file-${fileKey}`;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-blue-400 transition-colors">
      <label htmlFor={inputId} className="cursor-pointer">
        <div className="flex flex-col items-center">
          {fileData ? (
            <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mb-3 sm:mb-4" />
          ) : (
            <FiUpload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" />
          )}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            {subtitle}
          </p>

          {uploading ? (
            <div className="text-blue-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Uploading...</p>
            </div>
          ) : fileData ? (
            <div className="text-green-600">
              <p className="font-medium">{fileData.name}</p>
              <p className="text-sm">
                {fileData.data.length} rows, {fileData.headers.length} columns
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(inputId).click();
                }}
                className="mt-3 text-blue-600 hover:underline"
              >
                Change file
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">CSV or JSON files only</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </label>
      <input
        id={inputId}
        type="file"
        accept=".csv,.json"
        onChange={(e) => onFileUpload(e, fileKey)}
        className="hidden"
      />
    </div>
  );
};

// File Preview Component
const FilePreview = ({ title, data, headers }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                {headers.map((header) => (
                  <td key={header} className="px-3 py-2 text-gray-700">
                    {row[header] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Showing first {data.length} rows
      </p>
    </div>
  );
};

export default FileUpload;
