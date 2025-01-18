import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocument } from '../contexts/DocumentContext';
import { Alert } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileSpreadsheet, Upload } from 'lucide-react';

const FileUpload = () => {
  const { processDocument, processing, error, document } = useDocument();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      processDocument(file);
    }
  }, [processDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 30 * 1024 * 1024,
    multiple: false,
    disabled: processing
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {document ? (
            <FileSpreadsheet className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" />
          ) : (
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          )}
          <div className="space-y-1">
            <p className="text-sm sm:text-base font-medium text-gray-900">
              {document ? document.name : 'Drop your Excel file here'}
            </p>
            <p className="text-xs text-gray-500">
              XLSX or XLS up to 30MB
            </p>
          </div>
        </div>
      </div>

      {processing && (
        <div className="space-y-2">
          <Progress value={45} />
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Processing document...
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="text-sm">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;