# Excel Q&A Application

A web application that allows users to upload Excel files and ask questions about their content. The application provides an intuitive interface to analyze and query Excel data.

## Features

- Upload and process Excel files (XLSX/XLS)
- Support for files up to 30MB
- Interactive data preview
- Natural language querying of Excel content
- Real-time data visualization
- Responsive design for all devices

## Tech Stack

- React 18+
- Vite
- Tailwind CSS
- XLSX (SheetJS) for Excel processing
- UI Components

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sundeep1310/document-qa-app
cd document-qa-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── ui/
|        └── alert.jsx
|        └── button.jsx
|        └── card.jsx
|        └── input.jsx
|        └── progress.jsx          
│   ├── FileUpload.jsx
│   ├── QuestionInput.jsx
│   ├── AnswerDisplay.jsx
│   ├── DataPreview.jsx
│   └── Layout.jsx
├── contexts/
│   └── DocumentContext.jsx
├── lib/
│   └── utils.js
├── App.jsx
└── main.jsx
```

## Usage

1. Launch the application
2. Use the file upload area to upload an Excel file
3. Once uploaded, you'll see a preview of your data
4. Type your question in the input field
5. View the answers and relevant data from your Excel file

## Example Questions

You can ask questions like:
- "Show me rows containing [specific term]"
- "Find all entries with [value]"
- "List rows where [column] contains [value]"
- "Give me all rows related to [term]"

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup Development Environment

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

