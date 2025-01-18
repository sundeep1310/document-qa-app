import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const DocumentContext = createContext(null);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [document, setDocument] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);

  const processDocument = async (file) => {
    try {
      setProcessing(true);
      setError(null);

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true
          });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
          });

          // Clean the data removing empty rows and trimming cells
          const cleanedData = jsonData
            .filter(row => row.some(cell => cell))
            .map(row => row.map(cell => cell ? cell.toString().trim() : ''));

          setDocument(file);
          setData(cleanedData);
        } catch (error) {
          setError('Error processing document: ' + error.message);
        } finally {
          setProcessing(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setProcessing(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError(error.message);
      setProcessing(false);
    }
  };

  const analyzeQuestion = async (questionText) => {
    try {
      if (!data || data.length < 2) {
        throw new Error('Please upload a valid document first');
      }

      setQuestion(questionText);
      setProcessing(true);

      const headers = data[0];
      const dataRows = data.slice(1);
      
      // Search through all columns for relevant information
      const searchTerms = questionText.toUpperCase().split(' ');
      const relevantRows = dataRows.filter(row => 
        searchTerms.some(term => 
          row.some(cell => cell && cell.toString().toUpperCase().includes(term))
        )
      );

      const answer = relevantRows.length > 0 
        ? `Found ${relevantRows.length} matching entries.`
        : 'No matching data found for your query.';

      setAnswer({
        answer,
        relevantData: relevantRows.length > 0 ? [headers, ...relevantRows] : null
      });

    } catch (error) {
      setError(error.message);
      setAnswer(null);
    } finally {
      setProcessing(false);
    }
  };

  const value = {
    document,
    processing,
    error,
    data,
    question,
    answer,
    processDocument,
    analyzeQuestion,
    setError
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

DocumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DocumentContext;