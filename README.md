# Emotion Tracker App

A beautiful, dark-themed web application built with Svelte.js and Bulma.io for daily emotion and skills tracking. The app integrates with Google Sheets to automatically save user ratings and notes.

## Features

- 🎨 **Dark Theme**: Custom dark theme with very dark grey primary colors and light yellow accents
- 📊 **Emotion Tracking**: Rate emotions on a scale of 0-5 with intuitive UI
- 🧠 **Skills Assessment**: Track usage and effectiveness of various coping skills
- 📝 **Optional Notes**: Add daily reflections and thoughts
- ☁️ **Google Sheets Integration**: Automatically saves data to your spreadsheet
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🚀 **AWS Deployment**: Ready for deployment with Lambda, CloudFront, and S3

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd emotion-tracker
npm install
```

### 2. Set up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create credentials (API key)
5. Restrict the API key to Google Sheets API only
6. Make your spreadsheet publicly viewable or share it appropriately

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Google Sheets API key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## Deployment to AWS

### Prerequisites

- AWS CLI configured with appropriate permissions
- Serverless Framework (will be installed automatically)
- Google Sheets API key

### Deploy

```bash
export GOOGLE_SHEETS_API_KEY=your_api_key_here
./deploy.sh
```

This will:
- Build the application
- Deploy static files to S3
- Set up CloudFront distribution
- Configure Lambda functions (if needed)

## App Workflow

1. **Emotion Rating**: Users rate their emotions for the day (0-5 scale)
2. **Skills Assessment**: Users rate how well they used various coping skills
3. **Optional Notes**: Users can add reflections or thoughts about the day
4. **Auto-Save**: All data is automatically saved to the Google Spreadsheet

## Spreadsheet Structure

The app expects your Google Spreadsheet to have:
- **Column B**: Dates (format: M/D, e.g., "9/16")
- **Columns C-L**: Emotion ratings (Anger, Fear/Anxiety, Sadness, etc.)
- **Columns M-T**: Skill ratings (Mindfulness, Distress Tolerance, etc.)
- **Rows 34-40**: Notes (Column B, cells B34-B40)

## Customization

### Emotions and Skills

Edit the arrays in `src/App.svelte`:

```javascript
const emotions = [
  'Anger',
  'Fear/Anxiety', 
  'Sadness',
  // Add your emotions here
];

const skills = [
  'Mindfulness',
  'Distress Tolerance',
  // Add your skills here
];
```

### Theme Colors

Modify `src/styles/variables.scss`:

```scss
$primary: #2a2a2a; // Very dark grey
$secondary: #ffffe0; // Light yellow
// Customize other colors as needed
```

### Spreadsheet Mapping

Update the column mappings in `src/services/googleSheets.js` to match your spreadsheet structure.

## Development

### Project Structure

```
src/
├── components/          # Svelte components
│   ├── EmotionRating.svelte
│   ├── SkillRating.svelte
│   ├── NotesInput.svelte
│   └── ProgressBar.svelte
├── services/            # API services
│   └── googleSheets.js
├── styles/              # SCSS styles
│   └── variables.scss
├── App.svelte          # Main app component
└── main.js             # Entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Google Sheets API Issues

1. **403 Forbidden**: Check that your API key is correct and has Google Sheets API enabled
2. **Spreadsheet not found**: Verify the spreadsheet ID in `src/services/googleSheets.js`
3. **Permission denied**: Make sure the spreadsheet is publicly accessible or properly shared

### Deployment Issues

1. **AWS permissions**: Ensure your AWS credentials have the necessary permissions
2. **Environment variables**: Make sure `GOOGLE_SHEETS_API_KEY` is set before deployment
3. **Build errors**: Check that all dependencies are installed with `npm install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your own emotion tracking needs!

---

Built with ❤️ using Svelte.js and Bulma.io