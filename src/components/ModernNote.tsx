import React from "react";
import { Star, MoreVertical, Check, GripVertical, Archive as ArchiveIcon, Trash2, Edit } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Note } from "@/types/note";

interface ModernNoteProps {
  note: Note;
  editNote: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleStar: (id: string) => void;
  viewNote: (note: Note) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string, event: React.MouseEvent) => void;
  toggleArchive?: (id: string) => void;
}

const ModernNote = React.memo<ModernNoteProps>(({
  note,
  editNote,
  deleteNote,
  toggleStar,
  viewNote,
  isSelected = false,
  onToggleSelect,
  toggleArchive,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      onToggleSelect?.(note.id, e);
    } else {
      viewNote(note);
    }
  };

  // Convert markdown to plain text for preview
  const getPlainTextPreview = (markdown: string) => {
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Convert links to text
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/^>\s+/gm, '') // Remove blockquote markers
      .replace(/```[\s\S]*?```/g, '[code]') // Replace code blocks
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-note-id={note.id}
      className={`note-card group relative p-3 bg-gray-900/40 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-gray-900/60 ${
        isSelected
          ? 'border-teal-500 shadow-lg shadow-teal-500/20'
          : 'border-gray-800 hover:border-teal-500/50'
      }`}
      onClick={handleClick}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-lg z-10">
          <Check size={16} className="text-white" />
        </div>
      )}

      {/* Header with star, drag handle and menu */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
            title="Drag to reorder"
          >
            <GripVertical size={16} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(note.id);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {note.starred ? (
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
            ) : (
              <Star size={18} className="text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MoreVertical size={18} className="text-gray-400" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editNote(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors rounded-t-lg flex items-center gap-2"
                >
                  <Edit size={14} />
                  Edit
                </button>
                {toggleArchive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleArchive(note.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ArchiveIcon size={14} />
                    {note.archived ? 'Unarchive' : 'Archive'}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors rounded-b-lg flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-1.5 line-clamp-2">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
        {getPlainTextPreview(note.content)}
      </p>

      {/* Labels and Status */}
      {(note.labels.length > 0 || note.archived) && (
        <div className="flex flex-wrap gap-1.5">
          {note.labels.slice(0, 3).map((label, idx) => {
            return (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs font-medium text-teal-300 bg-teal-900/30 rounded-full"
              >
                {label}
              </span>
            );
          })}
          {note.labels.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-800 rounded-full">
              +{note.labels.length - 3}
            </span>
          )}
          {note.archived && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-100 bg-gray-800 rounded-full flex items-center gap-2">
              <ArchiveIcon size={14} />
              Archived
            </span>
          )}
        </div>
      )}
      
      {/* Hint for selection */}
      {!isSelected && (
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-600">Ctrl+Click to select</span>
        </div>
      )}
    </div>
  );
});

ModernNote.displayName = "ModernNote";

export default ModernNote;
