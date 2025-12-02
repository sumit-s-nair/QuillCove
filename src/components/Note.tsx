import React, { memo } from "react";
import { Star, Edit, Trash, Archive } from "lucide-react";

interface NoteType {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  labels: string[];
  archived?: boolean;
}

interface NoteProps {
  note: NoteType;
  editNote: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleStar: (id: string) => void;
  viewNote: (note: NoteType) => void;
  archiveNote?: (id: string) => void;
}

const Note: React.FC<NoteProps> = memo(({
  note,
  editNote,
  deleteNote,
  toggleStar,
  viewNote,
  archiveNote,
}) => {
  return (
    <div
      className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md h-auto flex flex-col justify-between cursor-pointer hover:bg-white/15 transition-all duration-200"
      onClick={() => viewNote(note)}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{note.title}</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(note.id);
          }}
          className="text-white hover:scale-110 transition-transform"
        >
          {note.starred ? <Star fill="currentColor" /> : <Star />}
        </button>
      </div>
      <p className="text-white/80 mb-4 text-sm line-clamp-3">
        {note.content}
      </p>
      <div className="flex justify-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            editNote(note.id);
          }}
          className="p-2 bg-blue-900/60 text-white rounded-lg hover:bg-blue-900/80 transition-colors flex items-center"
          aria-label="Edit note"
        >
          <Edit size={16} />
        </button>
        {archiveNote && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              archiveNote(note.id);
            }}
            className="p-2 bg-yellow-900/60 text-white rounded-lg hover:bg-yellow-900/80 transition-colors flex items-center"
            aria-label="Archive note"
          >
            <Archive size={16} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
          className="p-2 bg-red-900/60 text-white rounded-lg hover:bg-red-900/80 transition-colors flex items-center"
          aria-label="Delete note"
        >
          <Trash size={16} />
        </button>
      </div>
      <div className="flex flex-wrap mt-2 gap-2">
        {note.labels.map((label, idx) => (
          <span key={idx} className="bg-gray-700/60 text-white text-xs px-2 py-1 rounded">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
});

Note.displayName = 'Note';

export default Note;
