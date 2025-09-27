"use client";
import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  loading?: boolean;
  maxLength?: number;
}

const PromptInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Describe your AI workflow needs...",
  loading = false,
  maxLength = 1000,
}: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${scrollHeight}px`;
      setIsMultiline(scrollHeight > 60);
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter press, but allow new lines with Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const containerShapeClass = isMultiline ? 'rounded-3xl' : 'rounded-full';

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Animated gradient border */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-25 group-hover:opacity-40 transition-all duration-300 ${containerShapeClass}`}
        ></div>

        {/* Main input container */}
        <div
          className={`relative flex items-end bg-white border-2 border-slate-200 focus-within:border-purple-400 transition-all duration-300 ${containerShapeClass}`}
        >
          <textarea
            ref={textareaRef}
            disabled={loading}
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows={1}
            className="w-full pl-6 pr-20 py-4 bg-transparent text-lg text-slate-800 placeholder-slate-400 focus:outline-none resize-none overflow-y-auto"
            style={{
              minHeight: '60px',
              maxHeight: '240px', // Increased for better user experience
            }}
          />
          {/* Send Button */}
          <div className="absolute right-2 bottom-2">
            <button
              disabled={loading || !value.trim()}
              onClick={onSend}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:cursor-not-allowed"
              aria-label="Send prompt"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Character Counter */}
      {value.length > 50 && (
        <div className="text-right mt-2 pr-2">
          <span
            className={`text-sm transition-colors duration-300 ${
              value.length > maxLength ? 'text-red-500 font-medium' : 'text-slate-400'
            }`}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default PromptInput;