import React, { memo } from "react";
import { X } from "lucide-react";

interface NoteModalProps {
  isOpen: boolean;
  isEditing: boolean;
  newTitle: string;
  newContent: string;
  newLabels: string[];
  availableLabels: string[];
  setNewTitle: (title: string) => void;
  setNewContent: (content: string) => void;
  addLabel: (label: string) => void;
  addNote: () => void;
  closeModal: () => void;
}

const NoteModal: React.FC<NoteModalProps> = memo(({
  isOpen,
  isEditing,
  newTitle,
  newContent,
  newLabels,
  availableLabels,
  setNewTitle,
  setNewContent,
  addLabel,
  addNote,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? "Edit Note" : "Create Note"}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your note content..."
              rows={8}
            />
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {newLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-teal-500/20 text-teal-300 text-sm rounded-full border border-teal-500/30"
                >
                  {label}
                </span>
              ))}
            </div>
            
            <select
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              onChange={(e) => {
                if (e.target.value) {
                  addLabel(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Select or create a label
              </option>
              {availableLabels.map((label, idx) => (
                <option key={idx} value={label}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="w-full mt-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Or create a new label (press Enter)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  addLabel(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={addNote}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all font-medium"
          >
            {isEditing ? "Update Note" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
});

NoteModal.displayName = 'NoteModal';

export default NoteModal;
