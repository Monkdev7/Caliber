# Frontend Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │              App.jsx (Main)                   │  │  │
│  │  │  ┌──────────────────────────────────────────┐ │  │  │
│  │  │  │ State Management                         │ │  │  │
│  │  │  │ • jobs[]                                 │ │  │  │
│  │  │  │ • filteredJobs[]                         │ │  │  │
│  │  │  │ • filters{}                              │ │  │  │
│  │  │  │ • searchTerm                             │ │  │  │
│  │  │  │ • loading, error                         │ │  │  │
│  │  │  └──────────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                         ▼                             │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │        Components Hierarchy                      │ │  │
│  │  │                                                  │ │  │
│  │  │  ┌─────────┐    ┌──────────────┐               │ │  │
│  │  │  │ Header  │    │ FilterPanel  │               │ │  │
│  │  │  │ (Nav)   │    │ (Search)     │               │ │  │
│  │  │  └────┬────┘    └──────┬───────┘               │ │  │
│  │  │       │                 │                      │ │  │
│  │  │  ┌────▼────────────────▼─────┐                │ │  │
│  │  │  │  Job Grid Display         │                │ │  │
│  │  │  │  (JobCard x N)            │                │ │  │
│  │  │  └───────────────────────────┘                │ │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ▼                                    │
└─────────────────────────────────────────────────────────────┘
                         │
                    Axios HTTP
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌──────────────────────┐     ┌──────────────────────┐
│   Backend API        │     │   Python Scrapers    │
│   (Node.js/Express)  │────▶│   (LinkedIn/Naukri)  │
│                      │     │                      │
│ GET /api/jobs        │     │ Scrape job listings  │
│ POST /api/scrape     │     │ Parse HTML/data      │
└──────────────────────┘     └──────────────────────┘
        ▼
┌──────────────────────┐
│    Database          │
│    (MongoDB)         │
│                      │
│ jobs collection      │
└──────────────────────┘
```

---

## 🔄 Data Flow

```
USER INTERACTION
    │
    ├─▶ [Search Input]
    │       │
    │       ▼
    │   setSearchTerm()
    │       │
    │       ▼
    │   applyFilters() ◀─── useEffect trigger
    │       │
    │       ▼
    │   setFilteredJobs()
    │       │
    │       ▼
    │   [Re-render JobCards]
    │
    ├─▶ [Filter Selection]
    │       │
    │       ▼
    │   handleFilterChange()
    │       │
    │       ▼
    │   setFilters()
    │       │
    │       ▼
    │   applyFilters() ◀─── useEffect trigger
    │       │
    │       ▼
    │   setFilteredJobs()
    │       │
    │       ▼
    │   [Re-render with filtered results]
    │
    ├─▶ [Scrape Button]
    │       │
    │       ▼
    │   triggerScrape(source)
    │       │
    │       ▼
    │   POST /api/scrape
    │       │
    │       ▼
    │   Backend executes Python script
    │       │
    │       ▼
    │   Database updated with new jobs
    │       │
    │       ▼
    │   fetchJobs()
    │       │
    │       ▼
    │   GET /api/jobs
    │       │
    │       ▼
    │   setJobs()
    │       │
    │       ▼
    │   [Re-render with new jobs]
    │
    └─▶ [Export Button]
            │
            ▼
        exportToCSV()
            │
            ▼
        Generate CSV content
            │
            ▼
        Create Blob & download
            │
            ▼
        [jobs-YYYY-MM-DD.csv saved]
```

---

## 🧩 Component Interaction Diagram

```
                    ┌─────────────────────┐
                    │   App.jsx (Root)    │
                    │  - Manages State    │
                    │  - API Calls        │
                    │  - Filtering Logic  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │   Header     │ │ FilterPanel  │ │   JobCard    │
        ├──────────────┤ ├──────────────┤ ├──────────────┤
        │ Props:       │ │ Props:       │ │ Props:       │
        │ onScrape()   │ │ filters      │ │ job          │
        │              │ │ onChange()   │ │              │
        │ Renders:     │ │              │ │ Renders:     │
        │ • Logo       │ │ Renders:     │ │ • Title      │
        │ • Scrape BTN │ │ • Title in.  │ │ • Company    │
        │ • Mobile nav │ │ • Company in.│ │ • Location   │
        │              │ │ • Locatn in. │ │ • Salary     │
        │ Events:      │ │ • Source sel.│ │ • Date       │
        │ Click BTN    │ │              │ │ • Badge      │
        │              │ │ Events:      │ │ • Apply link │
        │              │ │ Type search  │ │              │
        │              │ │ Select item  │ │ Events:      │
        │              │ │              │ │ Click link   │
        │              │ │ Calls:       │ │              │
        │              │ │ onFilterChg()│ │              │
        └──────────────┘ └──────────────┘ └──────────────┘
             │                  │                  │
             │ Pass Props       │ Pass Props       │ Pass Props
             └──────────────────┼──────────────────┘
                                │
                    Callbacks update
                    App State
                                │
                    Re-render All
                   Child Components
```

---

## 🎯 State Update Flow

```
Initial State:
┌────────────────────┐
│ jobs: []           │
│ filteredJobs: []   │
│ loading: false     │
│ searchTerm: ""     │
│ filters: {}        │
│ error: null        │
└────────────────────┘
        │
        ▼
useEffect (on mount)
        │
        ▼
fetchJobs()
        │
        ▼
GET /api/jobs
        │
        ▼
setJobs(response.data)
        │
        ▼
┌────────────────────┐
│ jobs: [{...}, ...] │
│ filteredJobs: []   │
│ loading: false     │
│ searchTerm: ""     │
│ filters: {}        │
│ error: null        │
└────────────────────┘
        │
        ▼
useEffect (jobs changed)
        │
        ▼
applyFilters()
        │
        ▼
setFilteredJobs(filtered)
        │
        ▼
┌────────────────────┐
│ jobs: [{...}, ...] │
│ filteredJobs: [...] ALL
│ loading: false     │
│ searchTerm: ""     │
│ filters: {}        │
│ error: null        │
└────────────────────┘
        │
        ▼
User types in search
        │
        ▼
setSearchTerm(value)
        │
        ▼
useEffect triggers
        │
        ▼
applyFilters() - filter by searchTerm
        │
        ▼
setFilteredJobs(filtered)
        │
        ▼
┌────────────────────┐
│ jobs: [{...}, ...] │ (unchanged)
│ filteredJobs: [...] FILTERED
│ loading: false     │
│ searchTerm: "dev"  │
│ filters: {}        │
│ error: null        │
└────────────────────┘
```

---

## 🎨 Component Render Tree

```
<div className="min-h-screen bg-gradient-to-br">
  │
  ├─▶ <Header onScrape={triggerScrape} />
  │     ├─▶ <div className="logo">
  │     ├─▶ <nav> (Desktop menu)
  │     │     ├─▶ <button> Scrape LinkedIn
  │     │     └─▶ <button> Scrape Naukri
  │     ├─▶ <button> Mobile Menu Toggle
  │     └─▶ {showMenu && <div> Mobile Menu </div>}
  │
  ├─▶ <main className="max-w-7xl">
  │     ├─▶ {error && <div> Error Alert </div>}
  │     │
  │     ├─▶ <div> Search Section
  │     │     ├─▶ <input> Search field
  │     │     ├─▶ <button> Filters
  │     │     └─▶ <button> Export
  │     │
  │     ├─▶ {showFilters && <FilterPanel />}
  │     │     ├─▶ <input> Title filter
  │     │     ├─▶ <input> Company filter
  │     │     ├─▶ <input> Location filter
  │     │     ├─▶ <select> Source filter
  │     │     └─▶ <button> Clear Filters
  │     │
  │     ├─▶ <div> Statistics
  │     │     ├─▶ <div className="card"> Total Jobs
  │     │     ├─▶ <div className="card"> Total Sources
  │     │     └─▶ <div className="card"> Total Companies
  │     │
  │     ├─▶ {loading && <div> Loading State </div>}
  │     │
  │     ├─▶ {filteredJobs.length === 0 && <div> Empty State </div>}
  │     │
  │     └─▶ <div className="grid">
  │           {filteredJobs.map(job =>
  │             <JobCard key={job._id} job={job} />
  │               ├─▶ <div className="card">
  │               │   ├─▶ <h3> Job Title
  │               │   ├─▶ <p> Company Name
  │               │   ├─▶ <div> Location (Icon + Text)
  │               │   ├─▶ <div> Salary (Icon + Text)
  │               │   ├─▶ <div> Experience (Icon + Text)
  │               │   ├─▶ <div> Posted Date (Icon + Text)
  │               │   ├─▶ <p> Description
  │               │   ├─▶ <span className="badge"> Source
  │               │   └─▶ <a className="btn-primary"> Apply Now
  │           )}
  │
  └─▶ <footer>
        └─▶ <p> Copyright
```

---

## 🔌 API Integration Points

```
Frontend                Backend
   │                      │
   │─── GET /api/jobs ───▶│ Returns all jobs
   │                      │ [
   │                      │   {_id, title, company, ...},
   │                      │   ...
   │                      │ ]
   │◀─ Response ─────────│
   │
   │─ POST /api/scrape ──▶│ Trigger scraping
   │ {source: 'linkedin'} │ Execute Python script
   │                      │ Parse and save to DB
   │◀─ Response ─────────│ {success: true}
   │
   └─── GET /api/jobs ───▶│ Fetch updated jobs
        (refresh)         │ Return new + old
```

---

## 📊 Job Object Schema

```javascript
{
  _id: ObjectId,              // Database ID
  title: String,              // Job title
  company: String,            // Company name
  location: String,           // Job location
  salary: String,             // Salary range
  experience: String,         // Years of experience
  description: String,        // Job description
  url: String,                // Application link
  source: String,             // 'linkedin' or 'naukri'
  posted_date: Date,          // When job was posted
  scraped_at: Date,           // When we scraped it
  created_at: Date,           // DB creation date
  updated_at: Date            // DB update date
}
```

---

## 🎯 Filter Logic

```javascript
Input: jobs[], searchTerm, filters

Process:
1. Start with all jobs: filtered = jobs

2. Apply search filter:
   if (searchTerm) {
     filtered = filtered.filter(job =>
       job.title includes searchTerm OR
       job.company includes searchTerm
     )
   }

3. Apply title filter:
   if (filters.title) {
     filtered = filtered.filter(job =>
       job.title includes filters.title
     )
   }

4. Apply company filter:
   if (filters.company) {
     filtered = filtered.filter(job =>
       job.company includes filters.company
     )
   }

5. Apply location filter:
   if (filters.location) {
     filtered = filtered.filter(job =>
       job.location includes filters.location
     )
   }

6. Apply source filter:
   if (filters.source !== 'all') {
     filtered = filtered.filter(job =>
       job.source === filters.source
     )
   }

Output: filteredJobs = result
```

---

## 📱 Responsive Layout

```
MOBILE (< 640px)          TABLET (640-1024px)       DESKTOP (> 1024px)
┌───────────┐             ┌──────────────────┐      ┌─────────────────────┐
│ Logo      │             │ Logo     Menu    │      │ Logo       Menu     │
├───────────┤             ├──────────────────┤      ├─────────────────────┤
│ ☰         │             │ Search field     │      │ Search field (2col) │
├───────────┤             ├──────────────────┤      ├─────────────────────┤
│ Filter    │             │ [Filter Panel]   │      │ [Filter Panel]      │
│ Export    │             ├──────────────────┤      ├─────────────────────┤
├───────────┤             │  Stats (3 cols)  │      │ Stats (3 cols)      │
│ Stats (1) │             ├──────────────────┤      ├─────────────────────┤
│ Stats (2) │             │ Job Card (1 col) │      │ Job Cards (1 col)   │
│ Stats (3) │             │ Job Card (1 col) │      │ Job Cards (1 col)   │
├───────────┤             └──────────────────┘      └─────────────────────┘
│ Job Card  │
│ (full)    │
├───────────┤
│ Job Card  │
│ (full)    │
└───────────┘
```

---

## 🎨 Styling Cascade

```
Global Styles (index.css)
    ↓
Tailwind Directives (@tailwind base, components, utilities)
    ↓
Tailwind Config (tailwind.config.js)
    ├─ Colors
    ├─ Animations
    ├─ Custom components
    └─ Theme extensions
    ↓
Component Styles (App.css)
    ├─ Custom animations
    ├─ Tailwind utilities
    └─ Component classes
    ↓
Individual Component Classes (className)
    ├─ btn-primary
    ├─ btn-secondary
    ├─ card
    ├─ input-field
    └─ Tailwind utility classes
    ↓
Rendered HTML with Applied Styles
```

---

## 📈 Performance Optimization

```
Initial Load:
  ├─ React loads (React 19)
  ├─ Vite bundles code
  ├─ Tailwind CSS loads
  └─ Browser renders

User Interaction:
  ├─ setSearchTerm() → Re-render
  ├─ setFilters() → Re-render
  ├─ setJobs() → Re-render
  └─ useEffect filters data client-side (no API call)

API Call:
  ├─ GET /api/jobs → Once on mount
  ├─ POST /api/scrape → On demand
  └─ GET /api/jobs → After scraping

Memory Usage:
  ├─ Jobs stored in state (optimized)
  ├─ Filtered jobs computed (no extra storage)
  └─ Components memoized (no unnecessary renders)
```

---

This comprehensive architecture ensures:
✅ Clean separation of concerns  
✅ Efficient state management  
✅ Smooth user interactions  
✅ Responsive design  
✅ Scalable component structure
