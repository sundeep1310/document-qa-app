import { DocumentProvider } from './contexts/DocumentContext';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import QuestionInput from './components/QuestionInput';
import AnswerDisplay from './components/AnswerDisplay';
import DataPreview from './components/DataPreview';

const App = () => {
  return (
    <DocumentProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col py-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Document Q&A Assistant
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload an Excel file and ask questions about its content
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4 sm:space-y-6">
            {/* File Upload Section */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <FileUpload />
            </section>

            {/* Question & Data Display */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Ask a Question</h2>
              <QuestionInput />
            </section>

            {/* Data Preview */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Data Preview</h2>
              <div className="overflow-x-auto">
                <DataPreview />
              </div>
            </section>

            {/* Answer Display */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Answer</h2>
              <AnswerDisplay />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
            Built with React, Tailwind CSS, and Excel processing
          </div>
        </footer>
      </div>
    </DocumentProvider>
  );
};

export default App;