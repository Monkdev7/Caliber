# 🚀 Caliber Frontend - Quick Reference

## Installation (2 minutes)

```bash
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:5173**

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app, state management |
| `src/components/Header.jsx` | Navigation bar |
| `src/components/JobCard.jsx` | Job display card |
| `src/components/FilterPanel.jsx` | Search filters |
| `src/App.css` | Animations |
| `src/index.css` | Tailwind styles |
| `vite.config.js` | Vite config + API proxy |
| `tailwind.config.js` | Tailwind theme |

---

## 🎯 Key Features

### Search
```jsx
// Real-time search for jobs
<input 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search jobs by title or company..."
/>
```

### Filter
```jsx
// Advanced filtering
filters = {
  title: '',
  company: '',
  location: '',
  source: 'all'
}
```

### Export
```jsx
// Export filtered jobs to CSV
exportToCSV() // Downloads jobs-YYYY-MM-DD.csv
```

### Scrape
```jsx
// Trigger job scraping
triggerScrape('linkedin')  // or 'naukri'
```

---

## 🎨 Component Structure

```
App.jsx (Main)
├── Header.jsx
│   ├── Logo
│   ├── Desktop Menu (Scrape buttons)
│   └── Mobile Menu (Hamburger)
├── Search Input
├── FilterPanel.jsx
│   ├── Title filter
│   ├── Company filter
│   ├── Location filter
│   └── Source filter
├── Statistics Dashboard
│   ├── Total jobs
│   ├── Total sources
│   └── Total companies
├── JobCard.jsx (for each job)
│   ├── Job title & company
│   ├── Location, salary, experience
│   ├── Posted date
│   ├── Source badge
│   └── Apply button
└── Footer
```

---

## 🔧 Customization

### Change API URL
Edit `.env.local`:
```env
VITE_API_URL=http://your-backend:5000/api
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      secondary: '#YOUR_COLOR',
    }
  }
}
```

### Add More Filters
Edit `src/App.jsx` and `FilterPanel.jsx`:
```jsx
// Add to filters state
const [filters, setFilters] = useState({
  title: '',
  company: '',
  location: '',
  source: 'all',
  salary: '', // NEW
});
```

---

## 📊 State Management

```javascript
// Main App States
const [jobs, setJobs] = useState([])              // All jobs
const [filteredJobs, setFilteredJobs] = useState([]) // Filtered jobs
const [loading, setLoading] = useState(false)     // Loading state
const [error, setError] = useState(null)          // Error message
const [searchTerm, setSearchTerm] = useState('')  // Search text
const [showFilters, setShowFilters] = useState(false) // Filter panel visibility
const [filters, setFilters] = useState({...})     // Filter values
```

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/jobs` | Fetch all jobs |
| POST | `/api/scrape` | Trigger scraping |

### Example Calls

```javascript
// Fetch jobs
axios.get(`${API_URL}/jobs`)

// Scrape jobs
axios.post(`${API_URL}/scrape`, { source: 'linkedin' })
```

---

## 🎨 Tailwind Classes Used

### Buttons
```jsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
```

### Cards
```jsx
<div className="card">Content</div>
```

### Inputs
```jsx
<input className="input-field" />
```

### Layout
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## 🎬 Animations

```css
.animate-fade-in      /* 0.3s fade-in */
.animate-slide-up     /* 0.3s slide-up */
```

---

## 📱 Responsive Breakpoints

| Class | Size |
|-------|------|
| sm: | 640px and up |
| md: | 768px and up |
| lg: | 1024px and up |
| xl: | 1280px and up |

---

## 🐛 Debug Tips

### Check State
```javascript
console.log('Jobs:', jobs)
console.log('Filters:', filters)
console.log('API URL:', API_URL)
```

### Check API
```javascript
// Network tab in DevTools
// Check request URL and response
```

### Check Rendering
```javascript
// React DevTools extension
// Inspect component tree and props
```

---

## ⚡ Performance Tips

- Jobs are filtered client-side (no extra API calls)
- Components only re-render when state changes
- CSS is optimized with Tailwind
- Build is under 500KB gzipped

---

## 📦 Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code with ESLint
```

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Styling not loading | Clear cache & restart: `npm run dev` |
| API not connecting | Check backend is running on port 5000 |
| Port 5173 in use | Change port in `vite.config.js` |
| Components not showing | Check browser console for errors |
| Filters not working | Verify job data has correct fields |

---

## 📚 Component API

### Header Component
```jsx
<Header onScrape={handleScrape} />
```
**Props**: `onScrape` - Function called when scrape button clicked

### JobCard Component
```jsx
<JobCard job={jobObject} />
```
**Props**: `job` - Job object with title, company, location, etc.

### FilterPanel Component
```jsx
<FilterPanel 
  filters={filters} 
  onFilterChange={handleFilterChange} 
/>
```
**Props**: `filters`, `onFilterChange` - Current filters and callback

---

## 🌟 Key Features

✅ Search jobs by title/company  
✅ Filter by location and source  
✅ Export to CSV  
✅ Responsive design  
✅ Real-time filtering  
✅ Beautiful UI  
✅ Error handling  
✅ Loading states  

---

## 📞 Need Help?

1. Check `frontend/README.md` for detailed docs
2. Check `FRONTEND_SETUP.md` for setup help
3. Check `FRONTEND_BUILD_SUMMARY.md` for what was built
4. Check browser console (F12) for errors
5. Check network tab for API issues

---

## 🎓 Learning Resources

- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Vite Docs: https://vitejs.dev
- Lucide Icons: https://lucide.dev

---

**Created**: November 2024  
**Version**: 1.0  
**Status**: Production Ready ✅
