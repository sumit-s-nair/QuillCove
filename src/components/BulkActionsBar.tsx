import React from 'react';
import { Archive, Trash2, Star, Download, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onArchive: () => void;
  onDelete: () => void;
  onStar: () => void;
  onExport: () => void;
  onClear: () => void;
}

const BulkActionsBar = React.memo<BulkActionsBarProps>(({
  selectedCount,
  onArchive,
  onDelete,
  onStar,
  onExport,
  onClear,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-teal-900 to-cyan-900 border border-teal-500/50 rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
        <span className="text-white font-medium">
          {selectedCount} selected
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onStar}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Star selected"
          >
            <Star size={18} />
          </button>
          
          <button
            onClick={onArchive}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Archive selected"
          >
            <Archive size={18} />
          </button>
          
          <button
            onClick={onExport}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Export selected"
          >
            <Download size={18} />
          </button>
          
          <div className="w-px h-6 bg-white/20 mx-2" />
          
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-red-500/20 text-white hover:text-red-300 transition-colors"
            title="Delete selected"
          >
            <Trash2 size={18} />
          </button>
          
          <button
            onClick={onClear}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Clear selection"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});

BulkActionsBar.displayName = 'BulkActionsBar';

export default BulkActionsBar;
