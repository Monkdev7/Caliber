# 🗄️ How to Start MongoDB on Windows

## Option 1: Local MongoDB Installation (Recommended for Development)

### Step 1: Install MongoDB Community Edition
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer (mongodb-windows-x86_64-*.msi)
3. Choose "Install MongoDB as a Service" (easiest option)
4. Installation completes

### Step 2: Start MongoDB

**If installed as Windows Service (automatic):**
```powershell
# Already running - verify with:
Get-Service MongoDB
```

**If installed manually (or need to restart):**
```powershell
# Open PowerShell as Administrator, then:
mongod
# or
mongod --dbpath "C:\data\db"
```

**Expected output:**
```
{"t":{"$date":"..."},"s":"I","c":"CONTROL","id":23285,"ctx":"main","msg":"Listening on","attr":{"address":"127.0.0.1","port":27017}}
```

Keep this terminal open while developing.

---

## Option 2: Docker (Recommended for Clean Setup)

### Prerequisites:
- Docker Desktop installed on Windows

### Start MongoDB in Docker:

```powershell
# Run MongoDB container
docker run -d `
  -p 27017:27017 `
  --name mongodb `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=password `
  mongo:latest
```

**Verify it's running:**
```powershell
docker ps
# Should show mongodb container running
```

**Connect with credentials:**
- Update `.env` file:
  ```
  MONGODB_URI=mongodb://admin:password@localhost:27017/caliber?authSource=admin
  ```

**Stop MongoDB when done:**
```powershell
docker stop mongodb
```

**Start it again later:**
```powershell
docker start mongodb
```

---

## Option 3: MongoDB Atlas (Cloud - No Installation)

### Best for: Production, Remote Access, Free Tier

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account with email/password

### Step 2: Create Free Cluster
1. Click "Create" button
2. Select "Free" tier
3. Choose region (US East recommended)
4. Click "Create Cluster"
5. Wait 2-3 minutes for setup

### Step 3: Get Connection String
1. Click "Connect"
2. Click "Drivers"
3. Select "Node.js" and version "4.x"
4. Copy connection string
5. Replace `<password>` with your password
6. Replace `myFirstDatabase` with `caliber`

### Step 4: Update `.env` File
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/caliber?retryWrites=true&w=majority
```

---

## ✅ Verify MongoDB is Running

### Method 1: PowerShell Command
```powershell
# Test connection
mongosh --eval "db.version()"
# Should return MongoDB version
```

### Method 2: Check Port 27017
```powershell
netstat -ano | findstr ":27017"
# Should show LISTENING if MongoDB is running
```

### Method 3: From Node Backend
```bash
cd backend
npm run dev
# If backend starts successfully, MongoDB is connected
```

---

## 🎯 Quick Start (All 3 Options in One Command)

### For Local MongoDB:
```powershell
# PowerShell as Administrator
mongod
```
✅ Keep terminal open, move to step 2 in backend guide

### For Docker:
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
# ✅ Done, move to step 2 in backend guide
```

### For Atlas:
```powershell
# ✅ Update .env with connection string
# ✅ Move to step 2 in backend guide
```

---

## 🔄 Full System Startup Sequence

Once MongoDB is running, open **3 terminals**:

### Terminal 1: MongoDB (Keep Open)
```powershell
mongod
# or: docker start mongodb
# or: leave Atlas running
```

### Terminal 2: Backend
```powershell
cd backend
npm run dev
# Expected: 🚀 Server running on port 5000
```

### Terminal 3: View Frontend
```
Browser: http://localhost:5173
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "mongod not found" | Install MongoDB Community or use Docker |
| "Port 27017 already in use" | MongoDB already running, or kill process: `Get-Process mongod \| Stop-Process` |
| "Connection refused" | Start MongoDB first, wait 5 seconds |
| "ECONNREFUSED" from backend | Check MongoDB is running: `netstat -ano \| findstr ":27017"` |
| Docker won't start | Ensure Docker Desktop is open |
| Atlas connection fails | Verify connection string has correct credentials |

---

## 🎯 Recommended Setup

For development, **Option 2 (Docker)** is recommended because:
- ✅ Isolated from system
- ✅ Easy to start/stop
- ✅ No installation needed if Docker exists
- ✅ Clean, reproducible environment
- ✅ Can run in background

**If you already have MongoDB installed locally**, just use that:
- ✅ Simpler (one command: `mongod`)
- ✅ Faster startup
- ✅ No Docker overhead

---

## ⏭️ Next Steps After Starting MongoDB

1. MongoDB running ✅
2. **Start Backend:** `cd backend && npm run dev`
3. **Open Frontend:** http://localhost:5173
4. **Test Connection:** Click "Scrape LinkedIn" button
5. **Verify:** Jobs should appear in UI

---

**Which method would you like to use?**
- Local: `mongod`
- Docker: `docker run -d -p 27017:27017 mongo:latest`
- Cloud: MongoDB Atlas (sign up at mongodb.com)
