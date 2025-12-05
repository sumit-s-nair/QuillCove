// src/types/note.ts
export interface NoteType {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  labels: string[];
  archived?: boolean;
  pinned?: boolean;
  checklist?: ChecklistItem[];
  color?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Export Note as alias for backwards compatibility
export type Note = NoteType;

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; text: string }> = {
  default: { bg: 'from-gray-800/40 to-gray-900/40', border: 'border-gray-700/50', text: 'text-white' },
  red: { bg: 'from-red-900/40 to-red-950/40', border: 'border-red-700/50', text: 'text-red-100' },
  orange: { bg: 'from-orange-900/40 to-orange-950/40', border: 'border-orange-700/50', text: 'text-orange-100' },
  yellow: { bg: 'from-yellow-900/40 to-yellow-950/40', border: 'border-yellow-700/50', text: 'text-yellow-100' },
  green: { bg: 'from-green-900/40 to-green-950/40', border: 'border-green-700/50', text: 'text-green-100' },
  blue: { bg: 'from-blue-900/40 to-blue-950/40', border: 'border-blue-700/50', text: 'text-blue-100' },
  purple: { bg: 'from-purple-900/40 to-purple-950/40', border: 'border-purple-700/50', text: 'text-purple-100' },
  pink: { bg: 'from-pink-900/40 to-pink-950/40', border: 'border-pink-700/50', text: 'text-pink-100' },
};
