import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Code, List, ListOrdered, Heading1, Heading2, Quote, CheckSquare, Link as LinkIcon } from 'lucide-react';

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ content, onChange, placeholder = 'Start writing...' }) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = before) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + text + content.substring(start);
    onChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-800/40 bg-black/20">
        <button
          type="button"
          onClick={() => insertMarkdown('**')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Code"
        >
          <Code size={16} />
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertAtCursor('# ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor('## ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertAtCursor('- ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor('1. ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor('- [ ] ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Checklist"
        >
          <CheckSquare size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor('> ')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          className="p-2 rounded hover:bg-gray-800/60 text-gray-400 hover:text-teal-400 transition-colors"
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        
        <div className="flex-1" />
        
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            isPreview 
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40' 
              : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-4xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-4xl font-bold mb-6 mt-8 text-white border-b border-gray-800 pb-3" {...props} />,
                  h2: ({...props}) => <h2 className="text-3xl font-semibold mb-4 mt-6 text-white" {...props} />,
                  h3: ({...props}) => <h3 className="text-2xl font-semibold mb-3 mt-4 text-gray-200" {...props} />,
                  p: ({...props}) => <p className="mb-4 text-gray-300 leading-7 text-base" {...props} />,
                  ul: ({...props}) => <ul className="list-disc ml-6 mb-4 text-gray-300 space-y-2" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal ml-6 mb-4 text-gray-300 space-y-2" {...props} />,
                  li: ({...props}) => <li className="text-gray-300 leading-7" {...props} />,
                  blockquote: ({...props}) => (
                    <blockquote className="border-l-4 border-teal-500 bg-teal-500/5 pl-6 py-3 my-6 text-gray-300 italic" {...props} />
                  ),
                  code: ({inline, ...props}: {inline?: boolean; children?: React.ReactNode}) => 
                    inline 
                      ? <code className="bg-gray-800/80 text-teal-400 px-2 py-1 rounded font-mono text-sm" {...props} />
                      : <code className="block bg-gray-900 text-teal-300 p-6 rounded-xl overflow-x-auto my-6 font-mono text-sm border border-gray-800" {...props} />,
                  pre: ({...props}) => <pre className="my-6" {...props} />,
                  a: ({...props}) => <a className="text-teal-400 hover:text-teal-300 underline underline-offset-2" {...props} />,
                  strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                  em: ({...props}) => <em className="italic text-gray-200" {...props} />,
                  hr: ({...props}) => <hr className="border-gray-800 my-8" {...props} />,
                }}
              >
                {content || '*Nothing to preview yet...*'}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-8 bg-transparent text-gray-200 placeholder-gray-600 resize-none focus:outline-none text-base leading-7"
            style={{ caretColor: '#14b8a6', fontFamily: 'inherit' }}
          />
        )}
      </div>
    </div>
  );
};

export default PageEditor;
