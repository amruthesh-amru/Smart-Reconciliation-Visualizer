import React from "react";
import {
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import useReconciliationStore from "../store/reconciliationStore";

const InsightsPanel = () => {
  const { insights } = useReconciliationStore();

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No insights available</p>
      </div>
    );
  }

  const priorityColors = {
    high: "bg-red-50 border-red-200 text-red-800",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-800",
    low: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const priorityIcons = {
    high: FiAlertCircle,
    medium: FiTrendingUp,
    low: FiFileText,
  };

  return (
    <div className="space-y-6">
      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiAlertCircle className="mr-2 text-blue-600" />
          Automated Recommendations
        </h3>
        <div className="space-y-3">
          {insights.recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              recommendation={rec}
              priorityColors={priorityColors}
              priorityIcons={priorityIcons}
            />
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Mismatched Parties */}
        <InsightCard
          title="Top Mismatched Parties"
          icon={FiUsers}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        >
          {insights.topMismatchedParties.length > 0 ? (
            <div className="space-y-3">
              {insights.topMismatchedParties.map((party, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {party.party}
                    </p>
                    <p className="text-xs text-gray-500">
                      {party.mismatchCount} discrepancies • Variance: $
                      {party.totalAmountVariance}
                    </p>
                  </div>
                  <div className="ml-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No mismatched parties found</p>
          )}
        </InsightCard>

        {/* Problematic Fields */}
        <InsightCard
          title="Field Analysis"
          icon={FiFileText}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        >
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Most Problematic Field
              </p>
              <p className="text-lg sm:text-xl font-bold text-orange-900 uppercase">
                {insights.problematicFields.mostProblematic}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(insights.problematicFields.fieldCounts).map(
                ([field, count]) => (
                  <div
                    key={field}
                    className="flex justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-gray-600 capitalize">{field}:</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </InsightCard>

        {/* Date Patterns */}
        <InsightCard
          title="Date Pattern Analysis"
          icon={FiCalendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        >
          {insights.datePatterns.peakPeriod !== "N/A" ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Peak Period</p>
                <p className="text-lg font-bold text-blue-900">
                  {insights.datePatterns.peakPeriod}
                </p>
                <p className="text-sm text-blue-700">
                  {insights.datePatterns.peakCount} unmatched entries
                </p>
              </div>
              {insights.datePatterns.monthlyDistribution.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    Monthly Distribution:
                  </p>
                  <div className="space-y-1">
                    {insights.datePatterns.monthlyDistribution.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{item.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (item.count /
                                      insights.datePatterns.peakCount) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="font-medium text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No date patterns detected</p>
          )}
        </InsightCard>

        {/* Variance Analysis */}
        <InsightCard
          title="Variance Analysis"
          icon={FiDollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Total Variance</p>
                <p className="text-lg font-bold text-green-900">
                  ${insights.varianceAnalysis.totalVariance.amount}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Average Variance</p>
                <p className="text-lg font-bold text-blue-900">
                  ${insights.varianceAnalysis.averageVariance.amount}
                </p>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600 mb-1">
                Largest Single Variance
              </p>
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-bold text-red-900">
                  ${insights.varianceAnalysis.largestVariance.amount}
                </p>
                <span className="text-xs text-red-700 uppercase">
                  {insights.varianceAnalysis.largestVariance.type}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-600">Total Tax Variance:</span>
              <span className="font-medium text-gray-900">
                ${insights.varianceAnalysis.totalVariance.tax}
              </span>
            </div>
          </div>
        </InsightCard>
      </div>
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({
  recommendation,
  priorityColors,
  priorityIcons,
}) => {
  const Icon = priorityIcons[recommendation.priority];

  return (
    <div
      className={`p-4 rounded-lg border ${
        priorityColors[recommendation.priority]
      }`}
    >
      <div className="flex items-start">
        <Icon className="flex-shrink-0 mt-1 mr-3" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase">
              {recommendation.priority} Priority
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-white rounded">
              {recommendation.category}
            </span>
          </div>
          <p className="font-medium mb-2">{recommendation.message}</p>
          <p className="text-sm opacity-90">
            <strong>Action:</strong> {recommendation.action}
          </p>
        </div>
      </div>
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ title, icon: Icon, iconColor, iconBg, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${iconBg} mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      </div>
      {children}
    </div>
  );
};

export default InsightsPanel;
