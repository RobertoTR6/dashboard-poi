# Steps to Publish with Supabase

## 1. Configure Supabase (Free Plan is excellent)
1.  Go to [supabase.com](https://supabase.com/) and create a free account.
2.  Create a "New Project".
3.  Once the database is created, go to **Project Settings** (gear icon at the bottom left).
4.  Click on **API**.
5.  Copy the **Project URL** and the **Project API Key (anon / public)**.
6.  Open `js/auth.js` in your folder.
7.  Replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your copied values.
8.  **Create a User**: Go to the **Authentication** tab (left sidebar) -> **Users** -> **Add User** and create your email/password login.

## 2. Publish to GitHub
Since this folder is part of a larger structure, run these commands in your terminal **inside this folder** (`POI 2026`) to publish just this app:

```powershell
# Initialize a new repository here
git init

# Add files
git add .

# Commit
git commit -m "Initial commit of POI 2026 Dashboard"

# Create a new repository on GitHub.com named "dashboard-poi" (or similar)

# Link them (replace URL with your new repo URL)
git remote add origin https://github.com/YOUR_USERNAME/dashboard-poi.git

# Push
git push -u origin master
```

## 3. Enable hosting
1.  On GitHub, go to **Settings > Pages**.
2.  Select `master` (or `main`) branch and `/root` folder.
3.  Save. Your site will be live!
