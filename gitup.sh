#!/bin/bash

# Add all modified and new files
git add .

# Prompt for commit message
echo "Enter your commit message:"
read commit_message

# Commit with the provided message
git commit -m "$commit_message"

# Show the status after commit
echo "Changes committed successfully!"
git status
