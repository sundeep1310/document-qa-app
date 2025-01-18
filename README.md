# Document Q&A Application

A web-based application that allows users to upload Excel documents and ask questions about their content using AI-powered analysis.

## Features

- Document upload support for XLSX files
- AI-powered question answering system
- Real-time data processing
- Interactive UI with document preview
- Support for large files (up to 30MB)
- Responsive design for all devices

## Tech Stack

- Frontend: React.js with Vite
- Styling: Tailwind CSS
- File Processing: SheetJS (xlsx)
- UI Components: shadcn/ui
- State Management: React Context
- Data Visualization: Recharts
- Deployment: Vercel

## Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx
│   ├── QuestionInput.jsx
│   ├── AnswerDisplay.jsx
│   ├── DataPreview.jsx
│   └── Layout.jsx
├── contexts/
│   └── DocumentContext.jsx
├── hooks/
│   └── useDocumentProcessor.js
├── lib/
│   ├── xlsx-utils.js
│   └── ai-utils.js
├── App.jsx
└── main.jsx
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/sundeep1310/document-qa-app
cd document-qa-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
VITE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Usage

1. Upload an Excel document using the file upload button
2. Wait for the document to be processed
3. Ask questions about the document content in the question input field
4. View answers and relevant data visualizations in the response section

## Deployment

The application is deployed on Vercel. You can deploy your own instance by:

1. Fork this repository
2. Connect your fork to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

