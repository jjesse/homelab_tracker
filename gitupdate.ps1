# PowerShell script to add, commit, and push changes in Git

# Stage all changes
git add .

# Verify staged changes
git status

# Prompt for commit message
$commitMessage = Read-Host "Enter your commit message"

# Commit changes with the provided message
git commit -m $commitMessage

# Push changes to the remote repository
git push
