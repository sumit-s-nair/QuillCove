import React from "react";
import { Star, MoreVertical, Pin } from "lucide-react";

interface NoteType {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  labels: string[];
}

interface ModernNoteProps {
  note: NoteType;
  editNote: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleStar: (id: string) => void;
  viewNote: (note: NoteType) => void;
}

const ModernNote = React.memo<ModernNoteProps>(({
  note,
  editNote,
  deleteNote,
  toggleStar,
  viewNote,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className="group relative p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
      onClick={() => viewNote(note)}
    >
      {/* Header with star and menu */}
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(note.id);
          }}
          className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          {note.starred ? (
            <Star size={18} className="text-yellow-400 fill-yellow-400" />
          ) : (
            <Star size={18} className="text-gray-400" />
          )}
        </button>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <MoreVertical size={18} className="text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editNote(note.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-gray-400 mb-3 line-clamp-3">
        {note.content}
      </p>

      {/* Labels */}
      {note.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs font-medium text-gray-300 bg-gray-700/50 rounded-full"
            >
              {label}
            </span>
          ))}
          {note.labels.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-700/30 rounded-full">
              +{note.labels.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ModernNote.displayName = "ModernNote";

export default ModernNote;
