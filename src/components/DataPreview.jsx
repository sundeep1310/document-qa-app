import { useDocument } from '../contexts/DocumentContext';
import { Card } from '@/components/ui/card';

const DataPreview = () => {
  const { data, dataAnalysis, document } = useDocument();

  if (!document || !data || !dataAnalysis) {
    return null;
  }

  const { headers, statistics, columnAnalysis } = dataAnalysis;
  const nonEmptyRows = data.slice(1).filter(row => 
    row.some(cell => cell !== null && cell !== undefined && cell !== '' && cell !== '0')
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Rows</h3>
          <p className="mt-2 text-2xl font-semibold">{statistics.totalRows}</p>
          <p className="text-xs text-gray-500">{statistics.emptyRows} empty rows filtered</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Columns</h3>
          <p className="mt-2 text-2xl font-semibold">{statistics.totalColumns}</p>
          <p className="text-xs text-gray-500">
            {statistics.numericColumns} numeric, {statistics.dateColumns} date
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">File Size</h3>
          <p className="mt-2 text-2xl font-semibold">{(document.size / 1024).toFixed(2)} KB</p>
          <p className="text-xs text-gray-500">{document.name}</p>
        </Card>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    <div>{header}</div>
                    <div className="text-[10px] text-gray-400">
                      {columnAnalysis[index].isNumeric ? 'Number' : 
                       columnAnalysis[index].isDate ? 'Date' : 'Text'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nonEmptyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {headers.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap"
                    >
                      {row[colIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <h3 className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border-b">
          Column Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Column</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Values</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unique</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sample</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {columnAnalysis.map((col, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{col.header}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {col.isNumeric ? 'Number' : col.isDate ? 'Date' : 'Text'}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">{col.totalValues}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{col.uniqueValues}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    <span className="text-xs">
                      {col.sample.slice(0, 3).join(', ')}
                      {col.sample.length > 3 ? '...' : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Showing first {nonEmptyRows.length} rows of {data.length - 1} total rows
      </p>
    </div>
  );
};

export default DataPreview;