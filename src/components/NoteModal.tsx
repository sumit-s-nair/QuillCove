import React, { memo } from "react";
import { X } from "lucide-react";
import PageEditor from "./PageEditor";

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
  removeLabel: (label: string) => void;
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
  removeLabel,
  addNote,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex bg-black border-l border-gray-800">
      {/* Main Content Area - Notion Style */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/60 bg-black/40">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-900 rounded text-xs font-mono">Esc</kbd> to close
              </span>
              <span className="text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-900 rounded text-xs font-mono">Ctrl+S</kbd> to save
              </span>
            </div>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
            <X size={20} />
          </button>
        </div>

        {/* Page Content - Centered like Notion */}
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-12 py-12">
              {/* Title */}
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-5xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none mb-8"
                placeholder="Untitled"
                autoFocus
              />

              {/* Editor */}
              <div className="h-[calc(100vh-280px)]">
                <PageEditor
                  content={newContent}
                  onChange={setNewContent}
                  placeholder="Type / for commands, or start writing..."
                />
              </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel (Notion-like) */}
      <div className="w-80 border-l border-gray-800 bg-black/40 flex flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-800/60">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Properties</h3>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Labels Section */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Labels
            </label>
            
            {/* Selected Labels - Improved UI */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-2 bg-gray-900/50 rounded-lg border border-gray-800">
              {newLabels.length === 0 ? (
                <p className="text-xs text-gray-600 italic self-center">Click labels below to add</p>
              ) : (
                newLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="group px-3 py-1.5 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-teal-300 text-xs rounded-full border border-teal-500/40 flex items-center gap-2 hover:from-teal-500/40 hover:to-cyan-500/40 transition-all cursor-default"
                  >
                    <span className="font-medium">{label}</span>
                    <button
                      onClick={() => removeLabel(label)}
                      className="opacity-60 hover:opacity-100 hover:text-red-400 transition-all"
                      title="Remove label"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            
            {/* Available Labels - Tag Cloud Style */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {availableLabels.slice(0, 6).map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => addLabel(label)}
                    disabled={newLabels.includes(label)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                      newLabels.includes(label)
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-300 hover:bg-teal-500/20 hover:text-teal-400 hover:border-teal-500/40 border border-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Create New Label */}
            <div className="mt-4">
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                placeholder="+ Create new label (press Enter)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    addLabel(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="pt-4 border-t border-gray-800">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Document Info
            </label>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Words</span>
                <span className="text-gray-400">{newContent.split(/\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters</span>
                <span className="text-gray-400">{newContent.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer - Action Buttons */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={addNote}
            className="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            {isEditing ? "Update Note" : "Create Note"}
          </button>
          <button
            onClick={closeModal}
            className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

NoteModal.displayName = 'NoteModal';

export default NoteModal;
