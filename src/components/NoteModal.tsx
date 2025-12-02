import React, { memo } from "react";

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-20">
      <div className="p-8 rounded-lg shadow-lg bg-black/20 bg-blur-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Note" : "Add Note"}
        </h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Note Title"
        />
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Note Content"
          rows={4}
        />
        <div className="mb-4">
          <label className="block text-white mb-2">Labels</label>
          <div className="flex flex-wrap">
            {newLabels.map((label, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-white text-xs px-2 py-1 rounded mr-2 mb-2"
              >
                {label}
              </span>
            ))}
          </div>
          <select
            className="w-full p-2 rounded-lg border border-gray-300 bg-black/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => addLabel(e.target.value)}
          >
            <option value="" disabled selected>
              Add a label
            </option>
            {availableLabels.map((label, idx) => (
              <option className="bg-black/10 t" key={idx} value={label}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="w-full p-2 mt-2 rounded-lg border border-gray-300 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="New label"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addLabel(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addNote}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isEditing ? "Update Note" : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
});

NoteModal.displayName = 'NoteModal';

export default NoteModal;
