# GitHub Repository Setup Guide

## Steps to Create and Push to GitHub

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `linkedin-clone` (or your preferred name)
4. Description: "A full-stack LinkedIn clone built with React, Node.js, Express, and MongoDB"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### 2. Initialize Git and Push to GitHub

Open your terminal in the project root directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: LinkedIn Clone full-stack application"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/linkedin-clone.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. If You Already Have a Repository

If you've already initialized git, just add the remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/linkedin-clone.git
git branch -M main
git push -u origin main
```

### 4. Your Repository Link

After pushing, your repository will be available at:
```
https://github.com/YOUR_USERNAME/linkedin-clone
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Repository Structure

Your repository should include:
- ✅ `README.md` - Comprehensive documentation
- ✅ `.gitignore` - Excludes node_modules, .env, etc.
- ✅ `client/` - Frontend React application
- ✅ `server/` - Backend Express application
- ✅ All source code files

## Important Notes

⚠️ **Never commit these files:**
- `.env` files (contains secrets)
- `node_modules/` (dependencies)
- `uploads/` (user-uploaded files)
- Build artifacts

These are already in `.gitignore` to prevent accidental commits.

## Adding a License (Optional)

If you want to add a license:

1. Create `LICENSE` file in the root
2. Choose a license (MIT is common for open source)
3. Add it to your repository

Example MIT License content can be found at: https://choosealicense.com/licenses/mit/

