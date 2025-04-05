#!/bin/bash

# Add all modified and new files
git add .

# Prompt for commit message
echo "Enter your commit message:"
read commit_message

# Commit with the provided message
git commit -m "$commit_message"

# Check if commit was successful
if [ $? -eq 0 ]; then
    # Ask for confirmation to push
    echo "Do you want to push the changes? (y/n)"
    read push_confirm
    if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
        git push origin "$(git rev-parse --abbrev-ref HEAD)"
        echo "Changes committed and pushed successfully!"
    else
        echo "Changes committed but not pushed."
    fi
else
    echo "Commit failed, not pushing changes."
fi

# Show the status
git status
