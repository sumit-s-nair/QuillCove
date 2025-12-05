import React from 'react';
import { Check, X } from 'lucide-react';
import { ChecklistItem } from '@/types/note';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

const ChecklistEditor = React.memo<ChecklistEditorProps>(({ items, onChange }) => {
  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      completed: false,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, text: string) => {
    onChange(items.map(item => item.id === id ? { ...item, text } : item));
  };

  const toggleItem = (id: string) => {
    onChange(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-300">Checklist</label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full hover:bg-teal-500/30 transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                item.completed
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-gray-600 hover:border-teal-400'
              }`}
            >
              {item.completed && <Check size={14} className="text-white" />}
            </button>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, e.target.value)}
              className={`flex-1 px-3 py-2 bg-gray-900/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
                item.completed ? 'line-through opacity-60' : ''
              }`}
              placeholder="Checklist item..."
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No checklist items yet. Click &quot;Add Item&quot; to get started.
        </p>
      )}
    </div>
  );
});

ChecklistEditor.displayName = 'ChecklistEditor';

export default ChecklistEditor;
