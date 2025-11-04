#!/bin/bash

# Script to fix Convex dependencies
echo "Installing missing Convex dependencies..."

cd /home/mhatons/unclereuben.v1.0/client

# Install @convex-dev/auth packages
npm install @convex-dev/auth 

# Install oslo for crypto functions
npm install oslo

echo "Done installing dependencies!"

# Generate the needed types
echo "Generating Convex types..."
npx convex dev --typecheck=disable

echo "Setup complete!" 