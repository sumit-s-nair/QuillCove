import React, { memo } from "react";

interface SpotlightNoteProps {
  note: {
    title: string;
    content: string;
    labels: string[];
  } | null;
  closeSpotlight: () => void;
}

const SpotlightNote: React.FC<SpotlightNoteProps> = memo(({ note, closeSpotlight }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-30">
      <div className="p-8 rounded-lg shadow-lg bg-white/20 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 max-w-md">{note.title}</h2>
        <p className="text-lg mb-4 break-words">{note.content}</p>
        <div className="flex flex-wrap mb-4">
          {note.labels.map((label, idx) => (
            <span
              key={idx}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded mr-2 mb-2"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeSpotlight}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

SpotlightNote.displayName = 'SpotlightNote';

export default SpotlightNote;
