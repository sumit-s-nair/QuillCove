import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Code, Quote, Minus } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = React.memo<RichTextEditorProps>(({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Minus, command: 'insertHorizontalRule', title: 'Divider' },
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-900/30 border border-gray-700/50 rounded-lg">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => execCommand(btn.command, btn.value)}
            className="p-2 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            title={btn.title}
          >
            <btn.icon size={16} />
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        className={`min-h-[200px] p-4 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
          isFocused ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-gray-700'
        }`}
        data-placeholder={placeholder || 'Start writing...'}
        style={{
          ...(value ? {} : {
            position: 'relative',
          }),
        }}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
        }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
