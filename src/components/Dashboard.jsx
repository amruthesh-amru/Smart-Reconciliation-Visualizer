import React from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";
import useReconciliationStore from "../store/reconciliationStore";

const Dashboard = () => {
  const { summary, filters, setFilters } = useReconciliationStore();

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reconciliation data available</p>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Records",
      value: summary.totalRecords,
      icon: FiFileText,
      color: "blue",
      subtitle: "Processed",
    },
    {
      title: "Matched",
      value: summary.matchedCount,
      icon: FiCheckCircle,
      color: "green",
      subtitle: `${summary.matchedPercentage}% of total`,
      percentage: summary.matchedPercentage,
    },
    {
      title: "Partial Matches",
      value: summary.partialCount,
      icon: FiAlertCircle,
      color: "yellow",
      subtitle: `${summary.partialPercentage}% of total`,
      percentage: summary.partialPercentage,
    },
    {
      title: "Unmatched (A)",
      value: summary.unmatchedACount,
      icon: FiXCircle,
      color: "red",
      subtitle: "Only in File A",
    },
    {
      title: "Unmatched (B)",
      value: summary.unmatchedBCount,
      icon: FiXCircle,
      color: "red",
      subtitle: "Only in File B",
    },
    {
      title: "Amount Variance",
      value: `$${Math.abs(summary.totalVariance.amount).toFixed(2)}`,
      icon: FiDollarSign,
      color: "purple",
      subtitle: "Total difference",
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Records", color: "gray" },
    { value: "matched", label: "Matched", color: "green" },
    { value: "partial", label: "Partial", color: "yellow" },
    { value: "unmatchedA", label: "Unmatched A", color: "red" },
    { value: "unmatchedB", label: "Unmatched B", color: "red" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reconciliation Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Match Rate</span>
            <span className="font-semibold text-gray-900">
              {summary.matchedPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-500"
                style={{ width: `${summary.matchedPercentage}%` }}
                title={`Matched: ${summary.matchedPercentage}%`}
              />
              <div
                className="bg-yellow-500"
                style={{ width: `${summary.partialPercentage}%` }}
                title={`Partial: ${summary.partialPercentage}%`}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">
                Matched ({summary.matchedPercentage}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">
                Partial ({summary.partialPercentage}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">
                Unmatched (
                {(
                  ((summary.unmatchedACount + summary.unmatchedBCount) /
                    summary.totalRecords) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilters({ type: option.value })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.type === option.value
                  ? getActiveFilterClass(option.color)
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              {option.value !== "all" && (
                <span className="ml-2 text-sm">
                  (
                  {option.value === "matched"
                    ? summary.matchedCount
                    : option.value === "partial"
                    ? summary.partialCount
                    : option.value === "unmatchedA"
                    ? summary.unmatchedACount
                    : summary.unmatchedBCount}
                  )
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  percentage,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      {percentage !== undefined && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${
              color === "green"
                ? "bg-green-500"
                : color === "yellow"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Helper function to get active filter class
const getActiveFilterClass = (color) => {
  const classes = {
    gray: "bg-gray-600 text-white",
    green: "bg-green-600 text-white",
    yellow: "bg-yellow-600 text-white",
    red: "bg-red-600 text-white",
  };
  return classes[color] || classes.gray;
};

export default Dashboard;
