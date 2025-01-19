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

// Utility function to replace lodash.uniq
const getUniqueValues = (arr) => [...new Set(arr)];

export const DocumentProvider = ({ children }) => {
  const [document, setDocument] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);

  const cleanData = (jsonData) => {
    const headerRow = jsonData[0];
    const dataRows = jsonData.slice(1);

    const nonEmptyRows = dataRows.filter(row => {
      const hasNonEmptyValue = row.some(cell => {
        if (cell === undefined || cell === null) return false;
        const cellStr = cell.toString().trim();
        return cellStr !== '' && cellStr !== '0' && cellStr !== '0.0';
      });
      return hasNonEmptyValue;
    });

    return [headerRow, ...nonEmptyRows].map(row => 
      row.map(cell => cell ? cell.toString().trim() : '')
    );
  };

  const analyzeExcelData = (jsonData) => {
    const headers = jsonData[0] || [];
    const rows = jsonData.slice(1);
    
    const columnAnalysis = headers.map((header, index) => {
      const columnValues = rows.map(row => row[index]);
      const nonEmptyValues = columnValues.filter(val => 
        val !== undefined && 
        val !== null && 
        val.toString().trim() !== ''
      );
      const uniqueValues = getUniqueValues(nonEmptyValues);
      
      return {
        header,
        totalValues: nonEmptyValues.length,
        uniqueValues: uniqueValues.length,
        isEmpty: nonEmptyValues.length === 0,
        isNumeric: nonEmptyValues.every(val => !isNaN(val) && val !== ''),
        isDate: nonEmptyValues.every(val => !isNaN(Date.parse(val))),
        sample: uniqueValues.slice(0, 5)
      };
    });

    return {
      columnAnalysis,
      statistics: {
        totalRows: rows.length,
        totalColumns: headers.length,
        emptyRows: rows.filter(row => row.every(cell => !cell || cell.toString().trim() === '')).length,
        hasHeaders: headers.every(header => header && header.trim() !== ''),
        dateColumns: columnAnalysis.filter(col => col.isDate).length,
        numericColumns: columnAnalysis.filter(col => col.isNumeric).length
      },
      headers,
      sampleRows: rows.slice(0, 5)
    };
  };

  const processDocument = async (file) => {
    try {
      setProcessing(true);
      setError(null);

      if (file.size > 30 * 1024 * 1024) {
        throw new Error('File size exceeds 30MB limit');
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true,
            dateNF: 'yyyy-mm-dd'
          });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            raw: false,
            defval: ''
          });

          const cleanedData = cleanData(jsonData);
          const analysis = analyzeExcelData(cleanedData);
          
          setDocument(file);
          setData(cleanedData);
          setDataAnalysis(analysis);
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

  const findRelevantData = (searchTerms, rows) => {
    const normalizedTerms = searchTerms.map(term => term.toUpperCase());
    
    return rows.filter(row =>
      normalizedTerms.some(term =>
        row.some(cell => 
          cell && cell.toString().toUpperCase().includes(term)
        )
      )
    );
  };

  const analyzeQuestion = async (questionText) => {
    try {
      if (!data || !dataAnalysis) {
        throw new Error('Please upload a valid document first');
      }

      setQuestion(questionText);
      setProcessing(true);

      const searchTerms = questionText.toUpperCase()
        .split(' ')
        .filter(term => term.length > 2);

      const headers = data[0];
      const dataRows = data.slice(1);
      const relevantRows = findRelevantData(searchTerms, dataRows, headers);

      let answer = '';
      if (relevantRows.length > 0) {
        const matchingColumns = headers.filter((_, index) =>
          relevantRows.some(row => 
            searchTerms.some(term => 
              row[index]?.toString().toUpperCase().includes(term)
            )
          )
        );

        answer = `Found ${relevantRows.length} matching entries.`;
        if (matchingColumns.length > 0) {
          answer += ` Matches found in columns: ${matchingColumns.join(', ')}.`;
        }
      } else {
        answer = 'No matching data found in the document.';
      }

      setAnswer({
        answer,
        relevantData: relevantRows.length > 0 ? [headers, ...relevantRows] : null,
        matchCount: relevantRows.length
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
    dataAnalysis,
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