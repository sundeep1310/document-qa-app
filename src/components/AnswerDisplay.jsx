import { useDocument } from '../contexts/DocumentContext';

const AnswerDisplay = () => {
  const { answer, question, processing } = useDocument();

  if (!question && !answer) {
    return null;
  }

  return (
    <div className="space-y-4">
      {processing ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : answer ? (
        <div className="space-y-4">
          {/* Question Display */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Question:</h3>
            <p className="text-sm text-gray-900">{question}</p>
          </div>

          {/* Answer Display */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Answer:</h3>
            <p className="text-sm text-gray-900">{answer.answer}</p>
          </div>

          {/* Relevant Data Display */}
          {answer.relevantData && (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {answer.relevantData[0]?.map((header, i) => (
                          <th
                            key={i}
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {answer.relevantData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">
          Ask a question about your document...
        </p>
      )}
    </div>
  );
};

export default AnswerDisplay;