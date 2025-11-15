# Smart Reconciliation Visualizer

[![Test Coverage](https://img.shields.io/badge/tests-23%20passed-success)](./testsprite_tests/testsprite-mcp-test-report.md)
[![Test Pass Rate](https://img.shields.io/badge/pass%20rate-86.96%25-yellowgreen)](./testsprite_tests/testsprite-mcp-test-report.md)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A powerful React-based application for reconciling financial data from multiple sources with intelligent matching, variance analysis, and automated insights.

> **Built for WFYI Assignment** | Automated testing powered by TestSprite AI

## 🚀 Features

- **Dual File Upload**: Upload and compare two CSV/JSON files
- **Intelligent Column Mapping**: Automatically detect and map columns (docNo, party, date, amount, tax)
- **Smart Reconciliation**: Match records with configurable tolerances
  - Amount tolerance (percentage-based)
  - Date tolerance (day-based)
  - Party name fuzzy matching
- **Visual Dashboard**: Summary cards showing match statistics
- **Interactive Results Table**:
  - Color-coded rows (green/yellow/red)
  - Expandable detail views
  - Sort and filter capabilities
  - Pagination
- **Automated Insights**: AI-powered recommendations for discrepancies
- **Export Functionality**: Export reconciliation results to CSV
- **Demo Mode**: Pre-loaded sample data for quick testing

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5.0
- **CSV Parsing**: PapaParse 5.4
- **Icons**: React Icons 5.3
- **Date Utilities**: date-fns 4.1

## 📦 Project Structure

```
/src
  /components
    - FileUpload.jsx          (dual file upload UI)
    - ColumnMapper.jsx        (map CSV columns to required fields)
    - Dashboard.jsx           (summary cards & main view)
    - ResultsTable.jsx        (filterable table with expandable rows)
    - InsightsPanel.jsx       (automated recommendations)
    - SettingsPanel.jsx       (configure tolerances)
  /store
    - reconciliationStore.js  (Zustand state management)
  /utils
    - csvParser.js            (PapaParse wrapper)
    - reconciliationEngine.js (core matching logic)
    - insights.js             (generate recommendations)
    - export.js               (CSV export functionality)
  /data
    - sampleData.js           (demo mode data)
  - App.jsx
  - main.jsx
  - index.css
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd "D:\Desktop\WFYI Assignment"
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📊 How It Works

### 1. Upload Files

Upload two CSV or JSON files containing financial data (invoices, transactions, etc.)

### 2. Map Columns

Map your file columns to required fields:

- **docNo**: Document/Invoice number
- **party**: Vendor/Customer name
- **date**: Transaction date
- **amount**: Transaction amount
- **tax**: Tax amount (optional)

### 3. Configure Settings

Set tolerance levels:

- **Amount Tolerance**: 0-20% (default: 5%)
- **Date Tolerance**: 0-30 days (default: 3 days)

### 4. View Results

Results are categorized as:

- **Matched** (Green): Perfect match within tolerance
- **Partial** (Yellow): Document exists in both files but has differences
- **Unmatched A** (Red): Only in File A
- **Unmatched B** (Red): Only in File B

### 5. Analyze Insights

Get automated recommendations:

- Vendors with high mismatch rates
- Most problematic fields
- Date patterns in unmatched entries
- Variance summaries

### 6. Export Results

Download filtered or complete results as CSV for further analysis

## 📝 Sample Data Format

Your CSV/JSON files should contain columns like:

```csv
InvoiceNo,VendorName,Date,Amount,Tax
INV001,Acme Corp,2024-01-15,1000.00,180.00
INV002,TechSupplies,2024-01-16,2500.50,450.09
```

Sample files are provided in the `sample-files/` directory for quick testing.

## 🎨 Custom Match State Colors

The application uses custom Tailwind colors for visual clarity:

- **Matched**: Green (`#10b981`)
- **Partial**: Yellow/Amber (`#f59e0b`)
- **Unmatched**: Red (`#ef4444`)

## 🔧 Configuration

Tailwind configuration includes custom colors for match states. See `tailwind.config.js` for customization options.

## 🧪 Testing

This application has been comprehensively tested using **TestSprite AI** automated testing framework.

### Test Results Summary

- **Total Tests**: 23 test cases
- **Pass Rate**: 86.96% (20 passed, 3 failed)
- **Test Coverage**: File upload, column mapping, reconciliation, filtering, export, and insights

### Test Report

For detailed test results, analysis, and issue tracking, see the complete test report:

- 📊 [TestSprite Test Report](./testsprite_tests/testsprite-mcp-test-report.md)
- 🎥 [View Test Visualizations](https://www.testsprite.com/dashboard/mcp/tests/ede44071-c3f9-4e20-ab9d-eb9aacb63234)

### Known Issues

Based on automated testing, the following issues were identified:

1. **File B Upload** (High Priority) - File B upload functionality needs attention
2. **Export Filtered Results** (Medium Priority) - Export button for filtered data needs verification
3. **Reset Functionality** (Medium Priority) - Start Over button reset logic needs review

### Running Tests

Test artifacts are available in the `testsprite_tests/` directory:

- Test plan: `testsprite_frontend_test_plan.json`
- Test code: `TC-*.py` files
- Test report: `testsprite-mcp-test-report.md`

## 🐛 Troubleshooting

### Common Issues

**File upload not working?**

- Ensure you're using CSV or JSON files
- Check file size (max 50MB recommended)
- Try the "Use Demo Data" button for quick testing

**Reconciliation not matching?**

- Adjust tolerance settings (amount and date)
- Verify column mappings are correct
- Check that document numbers are consistent

**Results not displaying?**

- Ensure both files have been uploaded
- Verify column mapping is complete
- Check browser console for errors

**Export not working?**

- Currently a known issue with filtered exports
- Unfiltered export should work
- Try refreshing the page and re-running reconciliation

### Performance Tips

- For large files (>10,000 records), reconciliation may take 20-30 seconds
- Use filters to narrow down results for better performance
- Export filtered results to work with smaller datasets

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Maintain component modularity
- Add comments for complex logic
- Test changes before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TestSprite AI** - Automated testing framework
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **PapaParse** - For CSV parsing capabilities
- **Zustand** - For simple state management

## 📞 Support

For issues, questions, or suggestions:

- Open an issue in the GitHub repository
- Review the test report for known issues
- Check the troubleshooting section above

## 👤 Author

**Amruthesh**

Created for WFYI Assignment

---

**Note**: This project includes comprehensive automated testing. See the [test report](./testsprite_tests/testsprite-mcp-test-report.md) for detailed quality metrics and known issues.
