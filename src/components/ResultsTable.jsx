import React, { useState, useMemo } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiSearch,
  FiX,
} from "react-icons/fi";
import useReconciliationStore from "../store/reconciliationStore";
import { exportToCSV } from "../utils/export";

const ResultsTable = () => {
  const { getFilteredResults, filters, setFilters } = useReconciliationStore();

  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");

  const rowsPerPage = 20;

  // Get filtered results
  const filteredResults = getFilteredResults();

  // Sort results
  const sortedResults = useMemo(() => {
    if (!sortConfig.key) return filteredResults;

    return [...filteredResults].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "docNo":
          aValue = a.docNo;
          bValue = b.docNo;
          break;
        case "party":
          aValue = a.fileA?.party || a.fileB?.party || "";
          bValue = b.fileA?.party || b.fileB?.party || "";
          break;
        case "date":
          aValue = a.fileA?.date || a.fileB?.date || "";
          bValue = b.fileA?.date || b.fileB?.date || "";
          break;
        case "amount":
          aValue = a.fileA?.amount || a.fileB?.amount || 0;
          bValue = b.fileA?.amount || b.fileB?.amount || 0;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredResults, sortConfig]);

  // Paginate results
  const totalPages = Math.ceil(sortedResults.length / rowsPerPage);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleExport = () => {
    exportToCSV(sortedResults, "reconciliation_results.csv");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilters({ searchTerm: value });
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters({ searchTerm: "" });
  };

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (sortedResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">
          No results found for the current filters
        </p>
        <button
          onClick={() => setFilters({ type: "all", searchTerm: "" })}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header with Search and Export */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Reconciliation Results
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Showing {paginatedResults.length} of {sortedResults.length}{" "}
                records
              </p>
            </div>
            {/* Export Button - Desktop */}
            <button
              onClick={handleExport}
              className="hidden sm:flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
            {/* Export Button - Mobile */}
            <button
              onClick={handleExport}
              className="flex sm:hidden items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FiDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12"></th>
              <SortableHeader
                label="Doc No"
                sortKey="docNo"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Party"
                sortKey="party"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Date"
                sortKey="date"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Amount"
                sortKey="amount"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Type"
                sortKey="type"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {paginatedResults.map((record, index) => (
              <React.Fragment key={index}>
                <TableRow
                  record={record}
                  isExpanded={expandedRow === index}
                  onToggle={() => toggleRow(index)}
                />
                {expandedRow === index && <ExpandedRow record={record} />}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Sortable Header Component
const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => {
  const isActive = sortConfig.key === sortKey;

  return (
    <th
      onClick={() => onSort(sortKey)}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    >
      <div className="flex items-center">
        {label}
        {isActive && (
          <span className="ml-2">
            {sortConfig.direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );
};

// Table Row Component
const TableRow = ({ record, isExpanded, onToggle }) => {
  const getRowColor = () => {
    switch (record.type) {
      case "matched":
        return "bg-green-50 hover:bg-green-100";
      case "partial":
        return "bg-yellow-50 hover:bg-yellow-100";
      case "unmatchedA":
      case "unmatchedB":
        return "bg-red-50 hover:bg-red-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  const getTypeLabel = () => {
    switch (record.type) {
      case "matched":
        return { label: "Matched", color: "text-green-700 bg-green-100" };
      case "partial":
        return { label: "Partial", color: "text-yellow-700 bg-yellow-100" };
      case "unmatchedA":
        return { label: "Unmatched A", color: "text-red-700 bg-red-100" };
      case "unmatchedB":
        return { label: "Unmatched B", color: "text-red-700 bg-red-100" };
      default:
        return { label: "Unknown", color: "text-gray-700 bg-gray-100" };
    }
  };

  const typeInfo = getTypeLabel();
  const displayData = record.fileA || record.fileB;

  return (
    <tr className={`border-t border-gray-200 ${getRowColor()}`}>
      <td className="px-6 py-4">
        <button
          onClick={onToggle}
          className="text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {record.docNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {displayData?.party || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {displayData?.date || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        ${displayData?.amount?.toFixed(2) || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}
        >
          {typeInfo.label}
        </span>
      </td>
    </tr>
  );
};

// Expanded Row Component
const ExpandedRow = ({ record }) => {
  return (
    <tr className="bg-gray-50">
      <td colSpan="6" className="px-6 py-4">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Record Details</h4>

          {/* Side by side comparison */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* File A */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-3">File A</h5>
              {record.fileA ? (
                <dl className="space-y-2 text-sm">
                  <DetailItem label="Party" value={record.fileA.party} />
                  <DetailItem label="Date" value={record.fileA.date} />
                  <DetailItem
                    label="Amount"
                    value={`$${record.fileA.amount.toFixed(2)}`}
                  />
                  <DetailItem
                    label="Tax"
                    value={`$${record.fileA.tax.toFixed(2)}`}
                  />
                </dl>
              ) : (
                <p className="text-gray-500 text-sm">No data</p>
              )}
            </div>

            {/* File B */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-3">File B</h5>
              {record.fileB ? (
                <dl className="space-y-2 text-sm">
                  <DetailItem label="Party" value={record.fileB.party} />
                  <DetailItem label="Date" value={record.fileB.date} />
                  <DetailItem
                    label="Amount"
                    value={`$${record.fileB.amount.toFixed(2)}`}
                  />
                  <DetailItem
                    label="Tax"
                    value={`$${record.fileB.tax.toFixed(2)}`}
                  />
                </dl>
              ) : (
                <p className="text-gray-500 text-sm">No data</p>
              )}
            </div>
          </div>

          {/* Differences */}
          {record.differences && record.differences.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h5 className="font-medium text-yellow-900 mb-2">Differences</h5>
              <ul className="space-y-1 text-sm">
                {record.differences.map((diff, idx) => (
                  <li key={idx} className="text-yellow-800">
                    <strong>{diff.field}:</strong> {diff.valueA} → {diff.valueB}
                    {diff.percentageDiff !== undefined &&
                      ` (${diff.percentageDiff.toFixed(2)}% diff)`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variance */}
          {record.variance &&
            (record.variance.amount !== 0 || record.variance.tax !== 0) && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">Variance</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Amount Variance:</span>
                    <span
                      className={`ml-2 font-medium ${
                        record.variance.amount >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      ${record.variance.amount.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Tax Variance:</span>
                    <span
                      className={`ml-2 font-medium ${
                        record.variance.tax >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      ${record.variance.tax.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </td>
    </tr>
  );
};

// Detail Item Component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between">
    <dt className="text-gray-600">{label}:</dt>
    <dd className="text-gray-900 font-medium">{value}</dd>
  </div>
);

export default ResultsTable;
