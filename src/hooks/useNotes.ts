import { useState, useCallback, useRef, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface NoteType {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  labels: string[];
  archived?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Custom hook for managing notes with debounced Firebase sync
 * @param initialNotes - Initial notes array
 * @param initialLabels - Initial labels array
 * @returns Object with notes state and CRUD operations
 */
export function useNotes(initialNotes: NoteType[] = [], initialLabels: string[] = []) {
  const [notes, setNotes] = useState<NoteType[]>(initialNotes);
  const [availableLabels, setAvailableLabels] = useState<string[]>(initialLabels);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update notes when initial data changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    setAvailableLabels(initialLabels);
  }, [initialLabels]);

  // Debounced save to Firebase
  const debouncedSave = useCallback((updatedNotes: NoteType[], updatedLabels: string[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          await setDoc(
            userDoc,
            { notes: updatedNotes, labels: updatedLabels },
            { merge: true }
          );
        } catch (error) {
          console.error('Error saving to Firebase:', error);
          throw error;
        }
      }
    }, 1000); // 1 second debounce
  }, []);

  const addNote = useCallback((note: Omit<NoteType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NoteType = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
    
    return newNote;
  }, [notes, availableLabels, debouncedSave]);

  const updateNote = useCallback((id: string, updates: Partial<NoteType>) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    );
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
  }, [notes, availableLabels, debouncedSave]);

  const deleteNote = useCallback((id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
  }, [notes, availableLabels, debouncedSave]);

  const archiveNote = useCallback((id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, archived: true, updatedAt: Date.now() } : note
    );
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
  }, [notes, availableLabels, debouncedSave]);

  const restoreNote = useCallback((id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, archived: false, updatedAt: Date.now() } : note
    );
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
  }, [notes, availableLabels, debouncedSave]);

  const toggleStar = useCallback((id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, starred: !note.starred, updatedAt: Date.now() } : note
    );
    // Sort starred notes to the top
    updatedNotes.sort((a, b) => Number(b.starred) - Number(a.starred));
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, availableLabels);
  }, [notes, availableLabels, debouncedSave]);

  const addLabel = useCallback((label: string) => {
    if (!availableLabels.includes(label)) {
      const updatedLabels = [...availableLabels, label];
      setAvailableLabels(updatedLabels);
      debouncedSave(notes, updatedLabels);
    }
  }, [notes, availableLabels, debouncedSave]);

  const deleteLabel = useCallback((label: string) => {
    const updatedLabels = availableLabels.filter((l) => l !== label);
    const updatedNotes = notes.map((note) => {
      if (note.labels.includes(label)) {
        return { ...note, labels: note.labels.filter((l) => l !== label) };
      }
      return note;
    });
    setAvailableLabels(updatedLabels);
    setNotes(updatedNotes);
    debouncedSave(updatedNotes, updatedLabels);
  }, [notes, availableLabels, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    notes,
    availableLabels,
    addNote,
    updateNote,
    deleteNote,
    archiveNote,
    restoreNote,
    toggleStar,
    addLabel,
    deleteLabel,
  };
}
