# Smart Reconciliation Visualizer

A powerful React-based application for reconciling financial data from multiple sources with intelligent matching, variance analysis, and automated insights.

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

## 🎨 Custom Match State Colors

The application uses custom Tailwind colors for visual clarity:

- **Matched**: Green (`#10b981`)
- **Partial**: Yellow/Amber (`#f59e0b`)
- **Unmatched**: Red (`#ef4444`)

## 🔧 Configuration

Tailwind configuration includes custom colors for match states. See `tailwind.config.js` for customization options.

## 👤 Author

Created for WFYI Assignment By Amruthesh

---
