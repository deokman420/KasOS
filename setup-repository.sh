#!/bin/bash

# KasOS Repository Setup Script
# Initializes the repository and prepares it for GitHub

echo "🚀 Setting up KasOS Repository..."
echo "=================================="

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Set up Git configuration (if not already set)
if [ -z "$(git config user.name)" ]; then
    echo "⚙️  Git user configuration needed"
    echo "Please run these commands to set up Git:"
    echo "   git config --global user.name \"Your Name\""
    echo "   git config --global user.email \"your.email@example.com\""
    echo ""
fi

# Add remote origin if not already added
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/deokman420/kasos.git
    echo "✅ Remote origin added"
else
    echo "✅ Remote origin already configured"
fi

# Check repository status
echo ""
echo "📋 Repository Status:"
echo "   Remote: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"
echo "   Branch: $(git branch --show-current 2>/dev/null || echo 'No commits yet')"
echo ""

# Stage all files
echo "📦 Staging files for commit..."
git add .
echo "✅ Files staged"

# Show status
echo ""
echo "📊 Git Status:"
git status --short

echo ""
echo "🎯 Next Steps:"
echo "1. Review the staged files above"
echo "2. Make your first commit:"
echo "   git commit -m \"feat: initial KasOS repository with comprehensive versioning system\""
echo ""
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. Set up GitHub token for releases:"
echo "   export GITHUB_TOKEN=\"your_token_here\""
echo ""
echo "5. Test the versioning system:"
echo "   npm run version"
echo ""
echo "🚀 Repository is ready for first commit!"
