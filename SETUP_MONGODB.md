# 🚀 MongoDB Setup for Caliber

## Current Situation
- Docker: Not installed
- Local MongoDB: Not installed
- Backend: Running and waiting for MongoDB

## ✅ Fastest Solution: MongoDB Atlas (Cloud)

MongoDB Atlas is a **free cloud database** that takes 2 minutes to set up.

### Step 1: Create Account (2 min)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/password

### Step 2: Create Free Cluster (2 min)
1. After login, click "Create" 
2. Select **FREE** tier
3. Choose region: **US East (N. Virginia)**
4. Click "Create Cluster"
5. Wait 2-3 minutes for provisioning

### Step 3: Get Connection String (2 min)
1. Click "Connect"
2. Select "Drivers" tab
3. Choose "Node.js" and version "4.x"
4. Copy the connection string
5. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`

### Step 4: Create Database User (1 min)
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username: `caliber`
5. Enter password: `Caliber123!`
6. Click "Add User"

### Step 5: Allow Network Access (1 min)
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 6: Update .env File
Open `.env` in project root and update:

```env
MONGODB_URI=mongodb+srv://caliber:Caliber123!@cluster0.xxxxx.mongodb.net/caliber?retryWrites=true&w=majority
```

Replace the `xxxxx` part with your actual cluster name from the connection string.

### Step 7: Restart Backend
```powershell
# Kill the current backend (Ctrl+C in that terminal)
# Then restart it
cd C:\Users\mayan\Desktop\Caliber\backend
node server.js
```

---

## 🔄 If You Want Local MongoDB Instead

### Option A: Download & Install (15 min)
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (mongodb-windows-x86_64-*.msi)
3. During install, check "Install as Windows Service"
4. MongoDB will auto-start

### Option B: MongoDB Portable (5 min)
1. Download portable zip: https://www.mongodb.com/try/download/community
2. Extract to `C:\mongodb`
3. Create folder `C:\mongodb\data`
4. Run from PowerShell:
```powershell
C:\mongodb\bin\mongod.exe --dbpath C:\mongodb\data
```

---

## 📋 Comparison

| Option | Time | Pros | Cons |
|--------|------|------|------|
| **Atlas (Cloud)** | 5 min | Free, fast, no install | Internet required |
| **Local Install** | 15 min | Fast, local | Installation overhead |
| **Portable Zip** | 5 min | Quick setup | Manual startup each time |

---

## ✨ Recommended: Atlas Cloud

**Why?**
- ✅ Free tier (plenty for development)
- ✅ No installation needed
- ✅ Works immediately after setup
- ✅ Can access from anywhere
- ✅ Professional grade
- ✅ Automatic backups

**Estimated Total Time: 10 minutes**

---

## 🎯 After MongoDB is Ready

Once MongoDB is set up (Atlas or local):

1. ✅ Update `.env` with connection string
2. ✅ Restart backend
3. ✅ Open http://localhost:5173
4. ✅ Click "Scrape LinkedIn"
5. ✅ Jobs appear in UI

---

## Need Help?

If you choose **Atlas**:
- Atlas signup: 2 min
- Create cluster: 2 min  
- Get connection string: 2 min
- Create user: 1 min
- Network access: 1 min
- Update .env: 1 min
- Restart backend: 1 min
- **Total: ~10 minutes**

---

**Which option do you prefer?**
- Type `atlas` → Use MongoDB Atlas (cloud)
- Type `local` → Install local MongoDB
- Type `portable` → Use portable MongoDB zip

For now, I recommend **Atlas** - fastest and easiest! 🚀
