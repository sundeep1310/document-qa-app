import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellNF: true,
          cellStyles: true
        });

        const result = {
          sheets: {},
          metadata: {
            sheetNames: workbook.SheetNames,
            fileName: file.name,
            fileSize: file.size,
            lastModified: new Date(file.lastModified)
          }
        };

        // Process each sheet
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
          });

          // Get column headers
          const headers = jsonData[0] || [];

          // Get data preview
          const preview = jsonData.slice(1, 6);

          // Get column types
          const columnTypes = headers.map((_, index) => {
            const column = jsonData.slice(1).map(row => row[index]);
            return inferColumnType(column);
          });

          result.sheets[sheetName] = {
            headers,
            preview,
            columnTypes,
            rowCount: jsonData.length - 1, // Exclude header row
            data: jsonData
          };
        });

        resolve(result);
      } catch (error) {
        reject(new Error('Error processing Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

const inferColumnType = (values) => {
  // Remove null/undefined values
  const cleanValues = values.filter(v => v != null);
  if (cleanValues.length === 0) return 'empty';

  // Check if all values are dates
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (cleanValues.every(v => datePattern.test(String(v)))) {
    return 'date';
  }

  // Check if all values are numbers
  if (cleanValues.every(v => !isNaN(v) && v !== '')) {
    return 'number';
  }

  return 'string';
};

export const validateExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
  }

  const maxSize = 30 * 1024 * 1024; // 30MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 30MB limit');
  }

  return true;
};

export const getSheetSummary = (sheetData) => {
  const summary = {
    rowCount: sheetData.rowCount,
    columnCount: sheetData.headers.length,
    columns: sheetData.headers.map((header, index) => ({
      name: header,
      type: sheetData.columnTypes[index],
      sampleValues: sheetData.preview.map(row => row[index]).filter(v => v != null)
    }))
  };

  return summary;
};