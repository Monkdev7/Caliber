# Backend Setup & Connection Guide

## Quick Start - Get Backend Running in 3 Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
You need MongoDB running. Choose one option:

**Option A: Local MongoDB (If installed)**
```bash
mongod
# Keeps running - leave terminal open
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caliber
   ```

**Option C: Docker (If you have Docker)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
# or for production: npm start
```

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
```

---

## ✅ Verify Backend is Running

Open your browser and go to:
```
http://localhost:5000/health
```

Should see:
```json
{
  "status": "OK",
  "timestamp": "2024-11-25T...",
  "uptime": 123.456
}
```

---

## 📡 Available API Endpoints

### Get Jobs
```
GET http://localhost:5000/api/jobs
```
Returns all scraped jobs with pagination

### Scrape LinkedIn
```
POST http://localhost:5000/api/scrape/linkedin
```
Triggers LinkedIn job scraping

### Scrape Naukri
```
POST http://localhost:5000/api/scrape/naukri
```
Triggers Naukri job scraping

### Scrape All Sources
```
POST http://localhost:5000/api/scrape/all
```
Triggers all available scrapers

### Get Job Statistics
```
GET http://localhost:5000/api/jobs/stats
```
Returns job statistics

---

## 🔧 Configuration

Edit `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/caliber
DB_NAME=caliber

# Python Scraper Paths
LINKEDIN_SCRAPER_PATH=./linkedin.py
NAUKRI_SCRAPER_PATH=./naukri.py

# Job Retention
JOB_RETENTION_DAYS=30
```

---

## 🚨 Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in .env
3. If using Atlas, check IP whitelist

### Error: "Python script not found"
**Solution:**
1. Verify `linkedin.py` and `naukri.py` exist in project root
2. Update paths in `.env` if needed
3. Ensure Python is installed

### Error: "Port 5000 already in use"
**Solution:**
1. Change PORT in `.env` to 5001, 5002, etc.
2. Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Error: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database Models

### Job Document Structure
```javascript
{
  _id: ObjectId,
  jobId: String (unique),
  title: String,
  company: String,
  source: String ('linkedin' or 'naukri'),
  
  // LinkedIn fields
  timePosted: String,
  numApplicants: Number,
  
  // Naukri fields
  location: String,
  experienceRequired: String,
  description: String,
  jobUrl: String,
  
  // Metadata
  scrapedAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐍 Python Scrapers

Make sure these files exist in project root:
- `linkedin.py` - LinkedIn job scraper
- `naukri.py` - Naukri job scraper
- `main.py` - Main scraper orchestrator

The backend executes these Python scripts when you call the scraping endpoints.

---

## 🧪 Test the API

### Using curl:
```bash
# Test health check
curl http://localhost:5000/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Scrape LinkedIn
curl -X POST http://localhost:5000/api/scrape/linkedin

# Scrape Naukri
curl -X POST http://localhost:5000/api/scrape/naukri
```

### Using Postman or Thunder Client:
1. Create POST request to `http://localhost:5000/api/scrape/linkedin`
2. Should return job scraping result

---

## 🚀 Development Tips

### Auto-restart on file changes:
The backend uses `nodemon` which auto-restarts when files change.

### View logs:
Backend logs all requests and errors to console.

### Debug mode:
Set environment variable:
```bash
DEBUG=caliber:* npm run dev
```

---

## 📝 API Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

---

## 🔗 Frontend Connection

The frontend is already configured to connect to the backend!

**Frontend will:**
1. Fetch jobs from `GET /api/jobs`
2. Trigger scraping when you click "Scrape LinkedIn" or "Scrape Naukri"
3. Display results in real-time
4. Export to CSV

**Just make sure:**
- ✅ Backend running on port 5000
- ✅ MongoDB is connected
- ✅ Python scripts exist
- ✅ Frontend .env has correct API URL

---

## 📋 Pre-flight Checklist

Before launching, verify:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Python installed (`python --version`)
- [ ] MongoDB running or configured
- [ ] `linkedin.py` exists
- [ ] `naukri.py` exists
- [ ] `.env` file created with correct values
- [ ] Backend dependencies installed
- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:5000

---

## 🎯 Next Steps

1. **Install & start MongoDB**
2. **Run backend**: `npm run dev`
3. **Verify health**: `curl http://localhost:5000/health`
4. **Frontend ready**: Should connect automatically
5. **Test scraping**: Click scrape buttons in frontend
6. **View jobs**: Should appear in real-time

---

## 📞 Support

If backend doesn't connect:
1. Check MongoDB is running
2. Verify .env file exists with correct values
3. Check backend console for errors
4. Verify port 5000 is available
5. Check Python scripts are executable

---

**Backend is now connected to Frontend!** 🎊

The API is ready to receive requests from your React frontend at `http://localhost:5173`
