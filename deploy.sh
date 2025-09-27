#!/bin/bash

# Deployment script for Emotion Tracker app

set -e

echo "🚀 Starting deployment of Emotion Tracker..."

# Check if required environment variables are set
if [ -z "$GOOGLE_SHEETS_API_KEY" ]; then
    echo "❌ Error: GOOGLE_SHEETS_API_KEY environment variable is not set"
    echo "Please set it with: export GOOGLE_SHEETS_API_KEY=your_api_key_here"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "📦 Installing Serverless Framework..."
    npm install -g serverless
fi

# Install serverless plugins
echo "🔌 Installing Serverless plugins..."
npm install --save-dev serverless-s3-sync serverless-cloudfront-invalidate

# Deploy to AWS
echo "☁️  Deploying to AWS..."
serverless deploy --stage prod

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at the CloudFront URL shown above"
echo "📊 Make sure your Google Spreadsheet is publicly accessible or shared with the appropriate permissions"