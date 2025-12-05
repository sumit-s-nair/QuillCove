import React from 'react';
import { Download, Upload, FileJson, FileText, X } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportMarkdown: () => void;
  onImport: (file: File) => void;
}

const ExportImportModal = React.memo<ExportImportModalProps>(({
  isOpen,
  onClose,
  onExportJSON,
  onExportMarkdown,
  onImport,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Import / Export</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Download size={20} />
              Export Notes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onExportJSON}
                className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-teal-500/50 hover:bg-gray-900/70 transition-all group"
              >
                <FileJson size={32} className="text-teal-400" />
                <div className="text-center">
                  <div className="font-medium text-white">JSON</div>
                  <div className="text-xs text-gray-400">Full backup</div>
                </div>
              </button>

              <button
                onClick={onExportMarkdown}
                className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-500/50 hover:bg-gray-900/70 transition-all group"
              >
                <FileText size={32} className="text-blue-400" />
                <div className="text-center">
                  <div className="font-medium text-white">Markdown</div>
                  <div className="text-xs text-gray-400">Readable format</div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload size={20} />
              Import Notes
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="flex flex-col items-center gap-3 p-6 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg hover:border-teal-500/50 hover:bg-gray-900/70 transition-all cursor-pointer group"
            >
              <Upload size={32} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
              <div className="text-center">
                <div className="font-medium text-white">Choose JSON file</div>
                <div className="text-xs text-gray-400 mt-1">Click to browse or drag & drop</div>
              </div>
            </label>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 <strong>Tip:</strong> Export your notes regularly to keep a backup. Import will merge with existing notes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

ExportImportModal.displayName = 'ExportImportModal';

export default ExportImportModal;
