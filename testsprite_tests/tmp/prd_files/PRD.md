# Product Requirements Document (PRD)
## Smart Reconciliation Visualizer

**Version:** 1.0  
**Date:** 2024  
**Author:** WFYI Assignment  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Overview
The Smart Reconciliation Visualizer is a web-based application designed to automate and streamline the process of reconciling financial data from multiple sources. The application enables users to upload two CSV or JSON files containing financial transactions, invoices, or similar records, and automatically identifies matches, partial matches, and discrepancies with intelligent tolerance-based matching algorithms.

### 1.2 Problem Statement
Manual reconciliation of financial data between different systems or sources is time-consuming, error-prone, and requires significant human effort. Organizations need a tool that can:
- Automatically compare large datasets
- Handle variations in data formats and column names
- Identify matches even with minor discrepancies (amount differences, date variations, name variations)
- Provide actionable insights on discrepancies
- Export results for further analysis

### 1.3 Solution
A React-based single-page application that provides:
- Intuitive file upload interface
- Intelligent column mapping
- Configurable tolerance-based matching
- Visual dashboard with summary statistics
- Interactive results table with filtering and sorting
- Automated insights and recommendations
- CSV export functionality

### 1.4 Target Users
- **Primary Users:** Financial analysts, accountants, auditors, data analysts
- **Use Cases:** 
  - Invoice reconciliation
  - Transaction matching
  - Bank statement reconciliation
  - Vendor payment verification
  - General ledger reconciliation

---

## 2. Product Goals and Objectives

### 2.1 Primary Goals
1. **Accuracy:** Achieve high match accuracy with configurable tolerance levels
2. **Efficiency:** Reduce reconciliation time from hours/days to minutes
3. **Usability:** Provide intuitive interface requiring minimal training
4. **Flexibility:** Support various data formats and column structures
5. **Insights:** Generate actionable recommendations for discrepancies

### 2.2 Success Metrics
- **User Adoption:** Number of active users and reconciliation runs
- **Time Savings:** Average time reduction compared to manual reconciliation
- **Accuracy Rate:** Percentage of correctly identified matches
- **User Satisfaction:** Feedback scores and feature usage analytics

---

## 3. User Stories

### 3.1 File Management
- **US-001:** As a user, I want to upload two CSV/JSON files so that I can compare financial data from different sources
- **US-002:** As a user, I want to see file upload progress and validation errors so that I know if my files are valid
- **US-003:** As a user, I want to use demo data so that I can quickly test the application without preparing files

### 3.2 Column Mapping
- **US-004:** As a user, I want the system to automatically detect and suggest column mappings so that I don't have to manually map every column
- **US-005:** As a user, I want to manually adjust column mappings so that I can handle non-standard column names
- **US-006:** As a user, I want to see a preview of mapped data so that I can verify the mapping is correct

### 3.3 Reconciliation
- **US-007:** As a user, I want to configure amount tolerance (0-20%) so that I can handle minor amount discrepancies
- **US-008:** As a user, I want to configure date tolerance (0-30 days) so that I can handle date variations
- **US-009:** As a user, I want the system to use fuzzy matching for party names so that variations in naming don't prevent matches
- **US-010:** As a user, I want to see reconciliation results categorized (matched, partial, unmatched) so that I can focus on discrepancies

### 3.4 Results Visualization
- **US-011:** As a user, I want to see summary statistics (total matched, partial, unmatched) so that I can quickly assess reconciliation quality
- **US-012:** As a user, I want to see color-coded results (green/yellow/red) so that I can quickly identify match status
- **US-013:** As a user, I want to filter results by match type, party, or amount range so that I can focus on specific issues
- **US-014:** As a user, I want to search results by document number or party name so that I can find specific records
- **US-015:** As a user, I want to expand row details so that I can see full comparison information
- **US-016:** As a user, I want to sort results by various columns so that I can organize data for analysis

### 3.5 Insights and Analysis
- **US-017:** As a user, I want to see automated insights about discrepancies so that I can identify patterns and root causes
- **US-018:** As a user, I want to see recommendations for vendors with high mismatch rates so that I can prioritize investigations
- **US-019:** As a user, I want to see variance summaries so that I can understand the nature of discrepancies

### 3.6 Export and Reporting
- **US-020:** As a user, I want to export reconciliation results to CSV so that I can perform further analysis in Excel or other tools
- **US-021:** As a user, I want to export filtered results so that I can share specific subsets of data

---

## 4. Functional Requirements

### 4.1 File Upload Module

#### FR-001: File Upload Interface
- **Description:** Users must be able to upload two files (File A and File B)
- **Acceptance Criteria:**
  - Support CSV and JSON file formats
  - Maximum file size: 50MB (configurable)
  - Display file name and size after upload
  - Show validation errors for invalid files
  - Support drag-and-drop and click-to-upload
  - Clear visual distinction between File A and File B upload areas

#### FR-002: File Validation
- **Description:** System must validate uploaded files before processing
- **Acceptance Criteria:**
  - Validate file format (CSV/JSON)
  - Check for required minimum columns (at least 3 columns)
  - Detect encoding issues
  - Display clear error messages for invalid files
  - Support UTF-8 encoding

#### FR-003: Demo Mode
- **Description:** Provide pre-loaded sample data for testing
- **Acceptance Criteria:**
  - One-click demo data loading
  - Sample data includes various match scenarios (matched, partial, unmatched)
  - Clear indication when demo mode is active

### 4.2 Column Mapping Module

#### FR-004: Automatic Column Detection
- **Description:** System should automatically detect and suggest column mappings
- **Acceptance Criteria:**
  - Detect common column name patterns (invoice, docNo, document number, etc.)
  - Suggest mappings for: docNo, party, date, amount, tax
  - Use fuzzy matching for column name detection
  - Handle case-insensitive matching
  - Support common date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)

#### FR-005: Manual Column Mapping
- **Description:** Users must be able to manually select column mappings
- **Acceptance Criteria:**
  - Dropdown selectors for each required field
  - Show all available columns from uploaded files
  - Allow mapping to "None" for optional fields (tax)
  - Real-time preview of mapped data
  - Validation to ensure required fields are mapped

#### FR-006: Data Preview
- **Description:** Show preview of normalized data after mapping
- **Acceptance Criteria:**
  - Display first 5-10 rows of mapped data
  - Show data types and formats
  - Highlight any data quality issues
  - Allow users to go back and remap if needed

### 4.3 Reconciliation Engine

#### FR-007: Matching Algorithm
- **Description:** Core reconciliation logic to match records between files
- **Acceptance Criteria:**
  - Primary matching key: Document Number (docNo)
  - Secondary matching: Party name (fuzzy)
  - Amount matching with percentage tolerance
  - Date matching with day-based tolerance
  - Handle duplicate document numbers within same file
  - Performance: Process 10,000+ records in < 30 seconds

#### FR-008: Match Categories
- **Description:** Categorize matches into distinct types
- **Acceptance Criteria:**
  - **Matched:** Document exists in both files with all fields within tolerance
  - **Partial:** Document exists in both files but has field differences outside tolerance
  - **Unmatched A:** Document only in File A
  - **Unmatched B:** Document only in File B
  - Store variance details for partial matches

#### FR-009: Tolerance Configuration
- **Description:** Configurable tolerance levels for matching
- **Acceptance Criteria:**
  - Amount Tolerance: 0-20% (default: 5%)
  - Date Tolerance: 0-30 days (default: 3 days)
  - Party Name: Fuzzy matching with configurable threshold
  - Settings persist during session
  - Allow real-time recalculation when tolerances change

### 4.4 Dashboard Module

#### FR-010: Summary Statistics
- **Description:** Display high-level reconciliation statistics
- **Acceptance Criteria:**
  - Total records in File A and File B
  - Count of matched records
  - Count of partial matches
  - Count of unmatched records (A and B separately)
  - Match percentage
  - Total amount variance
  - Visual cards with icons and color coding

#### FR-011: Visual Indicators
- **Description:** Use color coding and visual elements for quick understanding
- **Acceptance Criteria:**
  - Green for matched records
  - Yellow/Amber for partial matches
  - Red for unmatched records
  - Progress indicators for reconciliation status
  - Loading states during processing

### 4.5 Results Table Module

#### FR-012: Results Display
- **Description:** Interactive table showing all reconciliation results
- **Acceptance Criteria:**
  - Display all match categories in single table
  - Color-coded rows based on match status
  - Columns: Match Type, Document No, Party, Date A, Date B, Amount A, Amount B, Variance, Actions
  - Responsive design for mobile/tablet
  - Pagination (default: 50 records per page)
  - Row expansion for detailed comparison

#### FR-013: Filtering
- **Description:** Filter results by various criteria
- **Acceptance Criteria:**
  - Filter by match type (all, matched, partial, unmatched A, unmatched B)
  - Filter by party name
  - Filter by amount range (min/max)
  - Text search across document numbers and party names
  - Multiple filters can be applied simultaneously
  - Show active filter count

#### FR-014: Sorting
- **Description:** Sort results by various columns
- **Acceptance Criteria:**
  - Sort by match type, document number, party, date, amount, variance
  - Ascending/descending toggle
  - Multi-column sorting support
  - Preserve sort order when filtering

#### FR-015: Row Details
- **Description:** Expandable row details showing full comparison
- **Acceptance Criteria:**
  - Expand/collapse individual rows
  - Show side-by-side comparison of all fields
  - Highlight differences in red
  - Show tolerance calculations
  - Display raw data from both files

### 4.6 Insights Module

#### FR-016: Automated Insights
- **Description:** Generate intelligent insights about reconciliation results
- **Acceptance Criteria:**
  - Identify vendors/parties with highest mismatch rates
  - Highlight most problematic fields (amount, date, party)
  - Detect date patterns in unmatched entries
  - Calculate variance summaries by party
  - Provide recommendations for investigation priorities
  - Show trend analysis if applicable

#### FR-017: Insights Display
- **Description:** Present insights in user-friendly format
- **Acceptance Criteria:**
  - Collapsible insights panel
  - Categorized insights (vendors, fields, patterns)
  - Actionable recommendations with explanations
  - Visual charts/graphs for patterns
  - Export insights as part of report

### 4.7 Settings Module

#### FR-018: Tolerance Settings
- **Description:** Configure reconciliation tolerances
- **Acceptance Criteria:**
  - Slider or input for amount tolerance (0-20%)
  - Slider or input for date tolerance (0-30 days)
  - Real-time preview of impact on match counts
  - Apply button to recalculate with new settings
  - Reset to defaults option

### 4.8 Export Module

#### FR-019: CSV Export
- **Description:** Export reconciliation results to CSV
- **Acceptance Criteria:**
  - Export all results or filtered subset
  - Include all relevant columns
  - Include match status and variance information
  - Preserve current filter/sort settings
  - File naming: `reconciliation_results_YYYYMMDD_HHMMSS.csv`
  - Handle special characters in data

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-001:** Application must load in < 3 seconds on standard broadband
- **NFR-002:** File parsing must complete in < 10 seconds for files up to 10MB
- **NFR-003:** Reconciliation must complete in < 30 seconds for 10,000 records
- **NFR-004:** UI must remain responsive during processing (show loading states)
- **NFR-005:** Support files up to 50MB in size

### 5.2 Usability
- **NFR-006:** Interface must be intuitive with minimal learning curve
- **NFR-007:** All actions must provide clear feedback (success, error, loading)
- **NFR-008:** Error messages must be clear and actionable
- **NFR-009:** Application must be responsive (mobile, tablet, desktop)
- **NFR-010:** Support keyboard navigation for accessibility

### 5.3 Reliability
- **NFR-011:** Application must handle invalid data gracefully without crashing
- **NFR-012:** All user actions must be reversible (undo, reset)
- **NFR-013:** Data must not be lost during navigation or refresh (consider local storage)
- **NFR-014:** Application must validate inputs before processing

### 5.4 Security
- **NFR-015:** All file processing must occur client-side (no server uploads)
- **NFR-016:** No sensitive data should be stored or transmitted
- **NFR-017:** Application must work offline (after initial load)

### 5.5 Compatibility
- **NFR-018:** Support modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **NFR-019:** Support CSV files with various delimiters (comma, semicolon, tab)
- **NFR-020:** Support multiple date formats (ISO 8601, US format, etc.)
- **NFR-021:** Handle various number formats (with/without currency symbols, decimals)

---

## 6. Technical Architecture

### 6.1 Technology Stack
- **Frontend Framework:** React 18.3
- **Build Tool:** Vite 6.0
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 5.0
- **CSV Parsing:** PapaParse 5.4
- **Icons:** React Icons 5.3
- **Date Utilities:** date-fns 4.1

### 6.2 Application Structure
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
  - App.jsx                   (main application component)
  - main.jsx                  (application entry point)
  - index.css                 (global styles)
```

### 6.3 State Management
- **Store:** Zustand store (`reconciliationStore.js`)
- **State Includes:**
  - Current workflow step (upload, mapping, results)
  - File data (File A, File B)
  - Column mappings
  - Reconciliation configuration (tolerances)
  - Normalized data
  - Reconciliation results
  - Summary statistics
  - Insights
  - Filters and UI state

### 6.4 Data Flow
1. **Upload:** Files uploaded → Parsed → Stored in state
2. **Mapping:** Columns mapped → Data normalized → Stored in state
3. **Reconciliation:** Normalized data + config → Reconciliation engine → Results stored
4. **Display:** Results + filters → UI components render

---

## 7. User Interface Design

### 7.1 Workflow Steps
1. **Step 1: Upload Files**
   - Two file upload areas (File A, File B)
   - Demo mode button
   - File validation feedback

2. **Step 2: Map Columns**
   - Column mapping interface
   - Auto-detection suggestions
   - Data preview
   - Back/Continue buttons

3. **Step 3: View Results**
   - Dashboard with summary cards
   - Settings panel (collapsible)
   - Results table with filters
   - Insights panel (collapsible)
   - Export button

### 7.2 Visual Design Principles
- **Color Scheme:**
  - Primary: Blue (#3B82F6) for actions and highlights
  - Success: Green (#10B981) for matched records
  - Warning: Amber (#F59E0B) for partial matches
  - Error: Red (#EF4444) for unmatched records
  - Neutral: Gray scale for backgrounds and text

- **Typography:** Clear, readable fonts with appropriate hierarchy
- **Spacing:** Consistent padding and margins
- **Responsive:** Mobile-first design approach

### 7.3 Key UI Components
- **Header:** Application title, subtitle, reset button
- **Step Indicator:** Visual progress through workflow
- **Loading Overlay:** Full-screen loading during processing
- **Error Messages:** Inline and global error display
- **Summary Cards:** Statistics with icons and colors
- **Data Table:** Sortable, filterable, expandable rows
- **Modals/Panels:** Collapsible sections for settings and insights

---

## 8. Data Models

### 8.1 File Data Structure
```javascript
{
  data: Array<Object>,      // Parsed rows
  headers: Array<String>,   // Column names
  name: String             // File name
}
```

### 8.2 Column Mapping Structure
```javascript
{
  fileA: {
    docNo: String | null,
    party: String | null,
    date: String | null,
    amount: String | null,
    tax: String | null
  },
  fileB: {
    docNo: String | null,
    party: String | null,
    date: String | null,
    amount: String | null,
    tax: String | null
  }
}
```

### 8.3 Normalized Data Structure
```javascript
{
  docNo: String,
  party: String,
  date: Date,
  amount: Number,
  tax: Number | null
}
```

### 8.4 Reconciliation Result Structure
```javascript
{
  matchType: 'matched' | 'partial' | 'unmatchedA' | 'unmatchedB',
  recordA: NormalizedData | null,
  recordB: NormalizedData | null,
  variances: {
    amount: Number,
    date: Number,  // days difference
    party: String  // similarity score
  }
}
```

### 8.5 Summary Statistics Structure
```javascript
{
  totalA: Number,
  totalB: Number,
  matched: Number,
  partial: Number,
  unmatchedA: Number,
  unmatchedB: Number,
  matchPercentage: Number,
  totalVariance: Number
}
```

---

## 9. Algorithms and Logic

### 9.1 Reconciliation Algorithm
1. **Index Creation:** Create maps/indexes for quick lookup by document number
2. **Primary Matching:** Match records by document number (exact match)
3. **Field Comparison:** For matched document numbers, compare:
   - Amount: Calculate percentage difference, check against tolerance
   - Date: Calculate day difference, check against tolerance
   - Party: Use fuzzy matching algorithm (Levenshtein distance)
4. **Categorization:** Classify as matched, partial, or unmatched based on field comparisons
5. **Unmatched Detection:** Identify records that exist in only one file

### 9.2 Fuzzy Matching Algorithm
- Use string similarity algorithms (Levenshtein distance, Jaro-Winkler)
- Normalize strings (lowercase, trim whitespace, remove special characters)
- Calculate similarity score (0-1)
- Threshold: > 0.8 for party name matching

### 9.3 Insights Generation Algorithm
1. **Vendor Analysis:** Group by party name, calculate mismatch rates
2. **Field Analysis:** Identify which fields (amount, date, party) have most discrepancies
3. **Pattern Detection:** Identify date patterns, amount ranges with issues
4. **Recommendations:** Prioritize vendors/records with highest variance or frequency

---

## 10. Testing Requirements

### 10.1 Unit Testing
- Test reconciliation engine with various data scenarios
- Test column mapping logic
- Test fuzzy matching algorithm
- Test data normalization functions
- Test export functionality

### 10.2 Integration Testing
- Test complete workflow (upload → map → reconcile → export)
- Test state management across components
- Test file parsing with various formats

### 10.3 User Acceptance Testing
- Test with real-world data samples
- Validate usability with target users
- Test performance with large files
- Validate accuracy of matching results

### 10.4 Edge Cases
- Empty files
- Files with only headers
- Files with duplicate document numbers
- Files with missing required fields
- Files with invalid data types
- Very large files (performance testing)
- Special characters in data
- Various date formats
- Various number formats

---

## 11. Deployment and Distribution

### 11.1 Build Process
- **Development:** `npm run dev` (Vite dev server on port 5173)
- **Production Build:** `npm run build` (outputs to `dist/` folder)
- **Preview:** `npm run preview` (preview production build)

### 11.2 Deployment Options
- Static hosting (Netlify, Vercel, GitHub Pages)
- Self-hosted web server
- Containerized deployment (Docker)

### 11.3 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 12. Future Enhancements (Out of Scope for v1.0)

### 12.1 Potential Features
- **Multi-file Reconciliation:** Support more than 2 files
- **Historical Tracking:** Save reconciliation history
- **User Accounts:** Multi-user support with saved preferences
- **API Integration:** Connect to external data sources
- **Advanced Analytics:** Charts and graphs for trends
- **Batch Processing:** Process multiple reconciliation jobs
- **Custom Matching Rules:** User-defined matching logic
- **Audit Trail:** Track all changes and actions
- **Collaboration:** Share reconciliation results with team
- **Mobile App:** Native mobile application

### 12.2 Technical Improvements
- **Backend Integration:** Server-side processing for large files
- **Database Storage:** Persist reconciliation results
- **Real-time Processing:** WebSocket for progress updates
- **Caching:** Cache parsed files for faster re-processing
- **Performance Optimization:** Web Workers for heavy computation

---

## 13. Dependencies and Constraints

### 13.1 External Dependencies
- React 18.3.1
- Zustand 5.0.2
- PapaParse 5.4.1
- React Icons 5.3.0
- date-fns 4.1.0
- Tailwind CSS 3.4.17
- Vite 6.0.1

### 13.2 Constraints
- Client-side only (no backend server)
- Browser-based (requires modern browser)
- File size limitations (browser memory constraints)
- Processing happens in main thread (may block UI for very large files)

---

## 14. Success Criteria

### 14.1 Functional Success
- ✅ All core features implemented and working
- ✅ Handles files up to 50MB
- ✅ Processes 10,000+ records successfully
- ✅ Accurate matching with configurable tolerances
- ✅ Export functionality works correctly

### 14.2 User Experience Success
- ✅ Intuitive interface requiring minimal training
- ✅ Clear error messages and feedback
- ✅ Responsive design works on all devices
- ✅ Fast performance (< 30 seconds for large files)

### 14.3 Quality Success
- ✅ No critical bugs
- ✅ Handles edge cases gracefully
- ✅ Code is maintainable and well-documented
- ✅ Follows React best practices

---

## 15. Glossary

- **Reconciliation:** The process of comparing two datasets to identify matches and discrepancies
- **Document Number (docNo):** Unique identifier for a transaction/invoice
- **Party:** Vendor, customer, or entity name
- **Tolerance:** Acceptable variance threshold for matching
- **Matched:** Records that exist in both files with all fields within tolerance
- **Partial Match:** Records that exist in both files but have field differences outside tolerance
- **Unmatched:** Records that exist in only one file
- **Normalized Data:** Data transformed to a standard format after column mapping
- **Fuzzy Matching:** Approximate string matching that handles variations and typos

---

## 16. Appendices

### 16.1 Sample Data Format
**CSV Format:**
```csv
InvoiceNo,VendorName,Date,Amount,Tax
INV001,Acme Corp,2024-01-15,1000.00,180.00
INV002,TechSupplies,2024-01-16,2500.50,450.09
```

**JSON Format:**
```json
[
  {
    "InvoiceNo": "INV001",
    "VendorName": "Acme Corp",
    "Date": "2024-01-15",
    "Amount": 1000.00,
    "Tax": 180.00
  }
]
```

### 16.2 Configuration Defaults
- Amount Tolerance: 5%
- Date Tolerance: 3 days
- Party Name Fuzzy Match Threshold: 0.8
- Records per page: 50
- Maximum file size: 50MB

---

**Document End**

