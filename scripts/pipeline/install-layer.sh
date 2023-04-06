#! /usr/bin/bash
cd src/layers/nodejs
echo "Installing packages for Lambda Layer..."
npm ci
pwd
echo "npm_modules for Lambda Layer installed OK."
