# Frontend Setup & Installation Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
# or
pnpm install
```

### 2. Install Tailwind CSS Dependencies
The package.json has been updated with:
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS processing
- `autoprefixer` - Vendor prefixes

These are automatically installed with `npm install`.

### 3. Configure Environment
```bash
cp .env.example .env.local
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx        - Navbar with scrape buttons
│   │   ├── JobCard.jsx       - Job listing display
│   │   └── FilterPanel.jsx   - Search and filter controls
│   ├── App.jsx               - Main app with state management
│   ├── App.css               - App-specific styles
│   ├── main.jsx              - React entry point
│   └── index.css             - Global Tailwind CSS
├── tailwind.config.js        - Tailwind configuration
├── postcss.config.js         - PostCSS configuration
├── vite.config.js            - Vite server config with API proxy
└── package.json              - Dependencies updated
```

## Features Implemented

✅ **Modern UI**
- Tailwind CSS with custom theme
- Responsive grid layouts
- Smooth animations and transitions
- Professional color scheme

✅ **Job Search**
- Real-time search input
- Advanced filter panel (title, company, location, source)
- CSV export functionality

✅ **Job Display**
- Beautiful job cards with all details
- Job statistics dashboard
- Empty state messaging
- Loading indicators

✅ **API Integration**
- Axios configured for backend communication
- Environment variable support
- Error handling with user feedback
- Vite proxy for development

✅ **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly buttons
- Collapsible mobile menu in header

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Production
npm run build        # Create optimized build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check code with ESLint
```

## Component Overview

### Header Component
- Logo and branding
- Desktop navigation menu
- Mobile hamburger menu
- Scrape buttons for LinkedIn and Naukri
- Responsive design

### JobCard Component
- Displays job title, company, location
- Shows salary, experience, and posting date
- Source badge (LinkedIn/Naukri)
- "Apply Now" button linking to job URL
- Hover effects and animations

### FilterPanel Component
- Filter by job title
- Filter by company name
- Filter by location
- Filter by source
- Clear all filters button
- Responsive grid layout

### App Component
- State management for jobs and filters
- API calls to fetch and scrape jobs
- Search functionality
- CSV export
- Error handling
- Loading states

## Styling Details

### Tailwind CSS Features Used
- Responsive breakpoints (sm, md, lg)
- Gradient backgrounds
- Shadow effects
- Transition utilities
- Animation utilities
- Grid and flex layouts

### Custom Classes
```css
.btn-primary      /* Blue action button */
.btn-secondary    /* Gray secondary button */
.card             /* White card with shadow */
.input-field      /* Styled form input */
```

### Animations
```css
@keyframes fadeIn    /* 0.3s fade-in effect */
@keyframes slideUp   /* 0.3s slide up effect */
```

## Environment Variables

Create a `.env.local` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## Dependencies Added

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

## Troubleshooting

### API Not Connecting
1. Make sure backend is running on port 5000
2. Check `VITE_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure backend API endpoints are correct

### Styling Not Applied
1. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Port Already in Use
If port 5173 is in use:
1. Kill the process: `lsof -i :5173` then `kill -9 <PID>`
2. Or edit `vite.config.js` to use a different port

## Next Steps

1. **Start Backend**: Make sure the backend API is running
2. **Run Frontend**: `npm run dev`
3. **Test Scraping**: Click "Scrape LinkedIn" or "Scrape Naukri"
4. **Search Jobs**: Use the search and filter features
5. **Export Data**: Click "Export" to download jobs as CSV

## Performance Tips

- Jobs are cached in state and filtered client-side
- Debounce search with a custom hook (optional future enhancement)
- Lazy load images if added
- Code splitting is automatic with Vite

## Browser DevTools

Use React Developer Tools extension:
- Inspect component hierarchy
- Check state and props
- Track re-renders
- Profile performance

## Production Build

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Support

For issues or questions, check:
1. Console errors in browser DevTools
2. Network tab for API calls
3. Component props and state
4. Backend API responses

---

Happy job hunting! 🚀
