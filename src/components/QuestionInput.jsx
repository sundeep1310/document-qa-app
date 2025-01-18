import { useState } from 'react';
import { useDocument } from '../contexts/DocumentContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const QuestionInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { analyzeQuestion, processing, document } = useDocument();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      analyzeQuestion(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
      <Input
        type="text"
        placeholder={document ? "Ask a question about your document..." : "Upload a document to ask questions"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={!document || processing}
        className="flex-1 text-sm sm:text-base"
      />
      <Button 
        type="submit" 
        disabled={!document || processing || !inputValue.trim()}
        className="w-full sm:w-auto"
      >
        <Send className="h-4 w-4 mr-2" />
        <span>Ask</span>
      </Button>
    </form>
  );
};

export default QuestionInput;