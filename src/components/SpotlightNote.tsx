import React, { memo } from "react";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white line-clamp-2 pr-4">
            {note.title}
          </h2>
          <button
            onClick={closeSpotlight}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Content */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Content</h3>
            <p className="text-lg text-gray-200 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>

          {/* Labels */}
          {note.labels.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {note.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-teal-500/20 text-teal-300 text-sm rounded-full border border-teal-500/30"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={closeSpotlight}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
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
