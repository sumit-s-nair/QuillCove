import React from "react";
import { Star, MoreVertical, Check } from "lucide-react";
import type { Note } from "@/types/note";

interface ModernNoteProps {
  note: Note;
  editNote: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleStar: (id: string) => void;
  viewNote: (note: Note) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string, event: React.MouseEvent) => void;
}

const ModernNote = React.memo<ModernNoteProps>(({
  note,
  editNote,
  deleteNote,
  toggleStar,
  viewNote,
  isSelected = false,
  onToggleSelect,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      onToggleSelect?.(note.id, e);
    } else {
      viewNote(note);
    }
  };

  return (
    <div
      className={`group relative p-4 bg-white dark:bg-gray-900 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-teal-500 shadow-lg shadow-teal-500/20 ring-2 ring-teal-500/30'
          : 'border-gray-200 dark:border-gray-800 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-lg z-10">
          <Check size={16} className="text-white" />
        </div>
      )}

      {/* Header with star and menu */}
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(note.id);
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {note.starred ? (
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
          ) : (
            <Star size={18} className="text-gray-400 dark:text-gray-500" />
          )}
        </button>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={18} className="text-gray-400 dark:text-gray-500" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editNote(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {note.content}
      </p>

      {/* Labels and Status */}
      {(note.labels.length > 0 || note.checklist?.length || note.archived) && (
        <div className="flex flex-wrap gap-1.5">
          {note.labels.slice(0, 3).map((label, idx) => {
            return (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 rounded-full"
              >
                {label}
              </span>
            );
          })}
          {note.labels.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
              +{note.labels.length - 3}
            </span>
          )}
          {note.checklist && note.checklist.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              ✓ {note.checklist.filter(item => item.completed).length}/{note.checklist.length}
            </span>
          )}
          {note.archived && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
              📦 Archived
            </span>
          )}
        </div>
      )}
      
      {/* Hint for selection */}
      {!isSelected && (
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-400 dark:text-gray-600">Ctrl+Click to select</span>
        </div>
      )}
    </div>
  );
});

ModernNote.displayName = "ModernNote";

export default ModernNote;
