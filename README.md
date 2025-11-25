# Caliber - Job Scraper Application

A full-stack job scraping application that collects job listings from multiple sources (LinkedIn, Naukri) and presents them in a beautiful, searchable web interface.

## Overview

Caliber is a modern job scraping tool with:
- 🕷️ **Web Scraping** - Extract jobs from LinkedIn and Naukri
- 🎨 **Beautiful Frontend** - React + Vite with Tailwind CSS
- 🔌 **Robust Backend** - Node.js/Express API
- 🔍 **Smart Search** - Filter by title, company, location, salary
- 📊 **Data Management** - Export to CSV, view statistics
- 📱 **Responsive Design** - Works on all devices

## Project Structure

```
caliber/
├── frontend/                 # React + Vite UI
│   ├── src/
│   │   ├── components/       # Header, JobCard, FilterPanel
│   │   ├── App.jsx          # Main application
│   │   ├── App.css          # Styles and animations
│   │   └── index.css        # Global Tailwind CSS
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
│
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend documentation
│
├── linkedin.py              # LinkedIn scraper
├── naukri.py               # Naukri scraper
├── main.py                 # Scraper orchestrator
├── requirements.txt        # Python dependencies
├── pyproject.toml         # Python project config
└── README.md              # This file
```

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (optional)
- **Axios** - HTTP requests
- **Child Process** - Execute Python scripts

### Python Scrapers
- **Selenium/BeautifulSoup** - Web scraping
- **Requests** - HTTP library
- **Pandas** - Data processing

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Monkdev7/Caliber.git
cd Caliber
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 3. Setup Backend

```bash
cd ../backend
npm install
npm start
```

Backend will be available at: `http://localhost:5000`

### 4. Setup Python Scrapers

```bash
cd ..
python -m venv .venv
.venv\Scripts\activate  # On Windows
# or
source .venv/bin/activate  # On macOS/Linux

pip install -r requirements.txt
```

## Features

### Job Search & Filtering
- 🔍 Search by job title or company
- 🏢 Filter by company name
- 📍 Filter by location
- 💼 Filter by job source (LinkedIn/Naukri)
- ⭐ View job statistics

### Data Management
- 📥 Scrape jobs from multiple sources
- 💾 Store jobs in database
- 📥 Export jobs to CSV
- 🔄 Real-time updates

### User Interface
- 📱 Fully responsive design
- ⚡ Fast and smooth interactions
- 🎨 Modern, professional styling
- 🌙 Clean dark-friendly design

## API Endpoints

### Jobs
- `GET /api/jobs` - Fetch all jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Scraping
- `POST /api/scrape` - Trigger scraping for a source
- `GET /api/scrape/status` - Get scrape status

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/caliber
NODE_ENV=development
```

## Running the Application

### All Services
```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: Python Scrapers (optional)
cd ..
python main.py
```

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm run build
npm start
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run lint         # Check code quality
npm run build        # Build for production
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run lint         # Check code quality
npm test             # Run tests
```

### Python Scrapers
```bash
python main.py       # Run main scraper
python linkedin.py   # Run LinkedIn scraper only
python naukri.py     # Run Naukri scraper only
```

## Database Schema

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  salary: String,
  experience: String,
  description: String,
  url: String,
  source: String,      // 'linkedin' or 'naukri'
  posted_date: Date,
  scraped_at: Date,
  created_at: Date,
  updated_at: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## Issues & Troubleshooting

### Frontend Won't Load
1. Check if backend is running: `http://localhost:5000`
2. Clear browser cache and hard refresh
3. Check `.env.local` API URL

### API Connection Failed
1. Verify backend is running
2. Check CORS settings in backend
3. Verify API URL in frontend `.env.local`

### Scraping Issues
1. Check Python environment is activated
2. Verify dependencies: `pip install -r requirements.txt`
3. Check browser/scraper logs for errors

### Database Connection
1. Ensure MongoDB is running
2. Check connection string in backend `.env`
3. Verify database credentials

## Performance Tips

- Frontend caches jobs in state
- Backend implements pagination
- Images are lazy-loaded
- CSS is optimized with Tailwind purging

## Security

- Environment variables for sensitive data
- Input validation on frontend and backend
- CORS configuration
- Rate limiting (recommended)
- SQL/NoSQL injection prevention

## Deployment

### Frontend Deployment
Deploy to: Vercel, Netlify, GitHub Pages, etc.

```bash
npm run build
# Upload dist/ folder
```

### Backend Deployment
Deploy to: Heroku, Railway, Render, AWS, etc.

```bash
npm run build
# Set environment variables
# Deploy server
```

## Performance Metrics

- ⚡ Frontend First Contentful Paint: < 1s
- 🚀 Backend Response Time: < 100ms
- 📊 Database Queries: Indexed and optimized
- 🔄 Real-time job updates

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Saved/bookmarked jobs
- [ ] Email job alerts
- [ ] AI-powered job recommendations
- [ ] Advanced salary analytics
- [ ] Integration with Indeed, Glassdoor
- [ ] Browser extension
- [ ] Mobile app (React Native)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Support

- **GitHub**: [Monkdev7/Caliber](https://github.com/Monkdev7/Caliber)
- **Issues**: [GitHub Issues](https://github.com/Monkdev7/Caliber/issues)
- **Author**: Monkdev7

## Acknowledgments

- React and Vite communities
- Tailwind CSS team
- Job boards for providing opportunities
- All contributors

---

**Happy job hunting! 🚀**

Made with ❤️ by Monkdev7