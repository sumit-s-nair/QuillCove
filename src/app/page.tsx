"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Plus, Search, LogOut, Menu, Download, Archive } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Background from "@/components/Background";
import ModernNote from "@/components/ModernNote";
import NoteModal from "@/components/NoteModal";
import FilterTabs from "@/components/FilterTabs";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import BulkActionsBar from "@/components/BulkActionsBar";
import ExportImportModal from "@/components/ExportImportModal";
import ToastContainer from "@/components/ToastContainer";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "@/contexts/ThemeContext";
import type { Note } from "@/types/note";
import { exportNotes, importNotes } from "@/utils/export";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newLabels, setNewLabels] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Notes");
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { showToast, toasts, hideToast } = useToast();
  const { toggleTheme } = useTheme();
  
  // Setup drag sensors for @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const openModalForNewNote = useCallback(() => {
    setNewTitle("");
    setNewContent("");
    setNewLabels([]);
    setIsEditing(false);
    setEditId(null);
    setShowEditor(true);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Normalize old notes to have new fields
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const normalizedNotes = (userData.notes || []).map((note: any) => ({
              ...note,
              checklist: note.checklist || [],
              archived: note.archived || false,
              createdAt: note.createdAt || Date.now(),
              updatedAt: note.updatedAt || Date.now(),
            }));
            setNotes(normalizedNotes);
            setAvailableLabels(userData.labels || []);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          showToast("Failed to load notes", "error");
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router, showToast]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'm', ctrl: true, callback: openModalForNewNote },
    { key: 'k', ctrl: true, callback: () => document.querySelector<HTMLInputElement>('input[placeholder="Search notes..."]')?.focus() },
    { key: 'Escape', callback: () => {
      setShowEditor(false);
      setIsExportModalOpen(false);
      setShowHelpModal(false);
      setSelectedNotes(new Set());
    }},
    { key: 'a', ctrl: true, callback: () => {
      // Select all depending on current archive view
      const filtered = notes.filter(n => n.archived === showArchived);
      if (filtered.length > 0) {
        setSelectedNotes(new Set(filtered.map(n => n.id)));
        showToast("All notes selected", "info");
      }
    }},
    { key: 'e', ctrl: true, callback: () => setIsExportModalOpen(true) },
    { key: '/', ctrl: true, callback: toggleTheme },
    { key: '?', callback: () => setShowHelpModal(true) },
  ]);

  const saveUserData = useCallback(async (updatedNotes: Note[], updatedLabels: string[]) => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      await setDoc(
        userDoc,
        { notes: updatedNotes, labels: updatedLabels },
        { merge: true }
      );
    }
  }, []);

  const addNote = useCallback(async () => {
    if (newTitle.trim() && newContent.trim()) {
      let updatedNotes;
      if (isEditing && editId !== null) {
        updatedNotes = notes.map((note) =>
          note.id === editId
            ? {
                ...note,
                title: newTitle,
                content: newContent,
                labels: newLabels,
              }
            : note
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        const newNote: Note = {
          id: uuidv4(),
          title: newTitle,
          content: newContent,
          starred: false,
          labels: newLabels,
          archived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        updatedNotes = [...notes, newNote];
      }
      setNotes(updatedNotes);
      await saveUserData(updatedNotes, availableLabels);
      setNewTitle("");
      setNewContent("");
      setNewLabels([]);
      setShowEditor(false);
    }
  }, [newTitle, newContent, newLabels, isEditing, editId, notes, availableLabels, saveUserData]);

  const deleteNote = useCallback(async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      onConfirm: async () => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        await saveUserData(updatedNotes, availableLabels);
        showToast('Note deleted', 'success');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  }, [notes, availableLabels, saveUserData, showToast]);

  const editNote = useCallback((id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      setNewTitle(note.title);
      setNewContent(note.content);
      setNewLabels(note.labels);
      setIsEditing(true);
      setEditId(id);
      setShowEditor(true);
    }
  }, [notes]);

  const viewNote = useCallback((note: Note) => {
    // Open note in split-screen editor instead of spotlight
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewLabels(note.labels);
    setIsEditing(true);
    setEditId(note.id);
    setShowEditor(true);
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, starred: !note.starred } : note
    );
    setNotes(
      updatedNotes.sort((a, b) => Number(b.starred) - Number(a.starred))
    );
    await saveUserData(updatedNotes, availableLabels);
  }, [notes, availableLabels, saveUserData]);

  const addLabel = useCallback(async (label: string) => {
    let updatedLabels = availableLabels;
    if (!availableLabels.includes(label)) {
      updatedLabels = [...availableLabels, label];
      setAvailableLabels(updatedLabels);
    }
    if (!newLabels.includes(label)) {
      setNewLabels([...newLabels, label]);
    }
    await saveUserData(notes, updatedLabels);
  }, [availableLabels, newLabels, notes, saveUserData]);

  const removeLabel = useCallback((label: string) => {
    setNewLabels(newLabels.filter((l) => l !== label));
  }, [newLabels]);

  // Delete label function (exposed for future label management UI)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteLabel = useCallback(async (label: string) => {
    const updatedLabels = availableLabels.filter((l) => l !== label);
    const updatedNotes = notes.map((note) => {
      if (note.labels.includes(label)) {
        return { ...note, labels: note.labels.filter((l: string) => l !== label) };
      }
      return note;
    });
    setAvailableLabels(updatedLabels);
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, updatedLabels);
  }, [availableLabels, notes, saveUserData]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, [router]);

  // Archive/Unarchive note
  const toggleArchive = useCallback(async (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, archived: !note.archived } : note
    );
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, availableLabels);
    const note = updatedNotes.find(n => n.id === id);
    showToast(note?.archived ? "Note archived" : "Note restored", "success");
  }, [notes, availableLabels, saveUserData, showToast]);

  // Handle export
  const handleExport = useCallback((format: 'json' | 'markdown') => {
    try {
      exportNotes(notes, format);
      showToast(`Notes exported as ${format.toUpperCase()}`, "success");
      setIsExportModalOpen(false);
    } catch {
      showToast("Failed to export notes", "error");
    }
  }, [notes, showToast]);

  // Separate export handlers for modal
  const handleExportJSON = useCallback(() => handleExport('json'), [handleExport]);
  const handleExportMarkdown = useCallback(() => handleExport('markdown'), [handleExport]);

  // Handle import
  const handleImport = useCallback(async (file: File) => {
    try {
      const importedNotes = await importNotes(file);
      const updatedNotes = [...notes, ...importedNotes];
      setNotes(updatedNotes);
      await saveUserData(updatedNotes, availableLabels);
      showToast(`Imported ${importedNotes.length} notes`, "success");
      setIsExportModalOpen(false);
    } catch {
      showToast("Failed to import notes", "error");
    }
  }, [notes, availableLabels, saveUserData, showToast]);

  // Bulk operations
  const handleBulkDelete = useCallback(async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Multiple Notes',
      message: `Are you sure you want to delete ${selectedNotes.size} note(s)? This action cannot be undone.`,
      onConfirm: async () => {
        const updatedNotes = notes.filter(n => !selectedNotes.has(n.id));
        setNotes(updatedNotes);
        await saveUserData(updatedNotes, availableLabels);
        showToast(`Deleted ${selectedNotes.size} notes`, "success");
        setSelectedNotes(new Set());
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  }, [notes, selectedNotes, availableLabels, saveUserData, showToast]);

  const handleBulkArchive = useCallback(async () => {
    const updatedNotes = notes.map(n => 
      selectedNotes.has(n.id) ? { ...n, archived: true } : n
    );
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, availableLabels);
    showToast(`Archived ${selectedNotes.size} notes`, "success");
    setSelectedNotes(new Set());
  }, [notes, selectedNotes, availableLabels, saveUserData, showToast]);

  const handleBulkStar = useCallback(async () => {
    const updatedNotes = notes.map(n => 
      selectedNotes.has(n.id) ? { ...n, starred: true } : n
    );
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, availableLabels);
    showToast(`Starred ${selectedNotes.size} notes`, "success");
    setSelectedNotes(new Set());
  }, [notes, selectedNotes, availableLabels, saveUserData, showToast]);

  const handleBulkExport = useCallback(() => {
    const selectedNotesList = notes.filter(n => selectedNotes.has(n.id));
    try {
      exportNotes(selectedNotesList, 'json');
      showToast(`Exported ${selectedNotes.size} notes`, "success");
    } catch {
      showToast("Failed to export notes", "error");
    }
  }, [notes, selectedNotes, showToast]);

  const toggleNoteSelection = useCallback((id: string) => {
    setSelectedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Drag-and-drop handler for reordering
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedNotes = arrayMove(items, oldIndex, newIndex);
        
        // Save to Firebase
        saveUserData(reorderedNotes, availableLabels);
        return reorderedNotes;
      });
      showToast('Notes reordered', 'success');
    }
  }, [availableLabels, saveUserData, showToast]);

  // Drag-to-select functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drag selection if not clicking on a note or button
    const target = e.target as HTMLElement;
    if (target.closest('.note-card') || target.closest('button')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    
    setDragCurrent({ x: e.clientX, y: e.clientY });
    
    // Calculate selection box
    const box = {
      left: Math.min(dragStart.x, e.clientX),
      right: Math.max(dragStart.x, e.clientX),
      top: Math.min(dragStart.y, e.clientY),
      bottom: Math.max(dragStart.y, e.clientY),
    };
    
    // Check which notes intersect with the selection box
    const noteElements = containerRef.current?.querySelectorAll('.note-card');
    const selected = new Set<string>();
    
    noteElements?.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const noteId = el.getAttribute('data-note-id');
      
      if (
        noteId &&
        rect.left < box.right &&
        rect.right > box.left &&
        rect.top < box.bottom &&
        rect.bottom > box.top
      ) {
        selected.add(noteId);
      }
    });
    
    setSelectedNotes(selected);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  }, []);

  // Selection box style
  const selectionBoxStyle = useMemo(() => {
    if (!isDragging || !dragStart || !dragCurrent) return {};
    
    const left = Math.min(dragStart.x, dragCurrent.x);
    const top = Math.min(dragStart.y, dragCurrent.y);
    const width = Math.abs(dragCurrent.x - dragStart.x);
    const height = Math.abs(dragCurrent.y - dragStart.y);
    
    return {
      position: 'fixed' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: '2px dashed #14b8a6',
      background: 'rgba(20, 184, 166, 0.1)',
      pointerEvents: 'none' as const,
      zIndex: 50,
    };
  }, [isDragging, dragStart, dragCurrent]);

  // Filtered notes based on search and active filter
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(
      (note) =>
        note &&
        note.title &&
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         note.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
        note.archived === showArchived
    );

    if (activeFilter === "Starred") {
      filtered = filtered.filter((note) => note.starred);
    } else if (activeFilter !== "All Notes") {
      filtered = filtered.filter((note) => note.labels.includes(activeFilter));
    }

    return filtered;
  }, [notes, searchQuery, activeFilter, showArchived]);

  const starredCount = useMemo(() => notes.filter(n => n.starred && !n.archived).length, [notes]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
        <Background />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <Background />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-teal-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 dark:from-teal-500 dark:to-cyan-500 bg-clip-text text-transparent">
                QuillCove
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Archive Toggle */}
              <button
                onClick={() => {
                  setShowArchived(!showArchived);
                  showToast(showArchived ? "Showing active notes" : "Showing archived notes", "info");
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  showArchived 
                    ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" 
                    : "bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700/50"
                }`}
                title={showArchived ? "Show Active" : "Show Archived"}
              >
                <Archive size={16} className="inline mr-1" />
                {showArchived ? "Archived" : "Active"}
              </button>

              {/* Export/Import */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Export/Import Notes (Ctrl+E)"
              >
                <Download size={20} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700/50 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
                  placeholder="Search notes... (Ctrl+K)"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Sidebar - Notes List */}
        <div className={`${showEditor ? 'w-96 border-r border-gray-800' : 'w-full max-w-7xl mx-auto'}  flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Filter Tabs */}
          <div className="py-6 border-b border-gray-800">
            <FilterTabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              availableLabels={availableLabels}
              noteCount={notes.filter(n => !n.archived).length}
              starredCount={starredCount}
            />
          </div>

          {/* Notes List */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex-1 overflow-y-auto p-4"
          >
            {filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  {searchQuery ? "No notes found" : "No notes yet"}
                </p>
                {!searchQuery && (
                  <p className="text-gray-500 text-sm">
                    Click the + button or press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs font-mono">Ctrl+M</kbd> to create your first note
                  </p>
                )}
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredNotes.map(note => note.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 animate-fade-in">
                    {filteredNotes.map((note) => (
                      <ModernNote
                        key={note.id}
                        note={note}
                        editNote={editNote}
                        deleteNote={deleteNote}
                        toggleStar={toggleStar}
                        viewNote={viewNote}
                        isSelected={selectedNotes.has(note.id)}
                        onToggleSelect={toggleNoteSelection}
                        toggleArchive={toggleArchive}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            
            {/* Drag selection box */}
            {isDragging && <div style={selectionBoxStyle} />}
          </div>
        </div>

        {/* Right Panel - Editor */}
        {showEditor && (
          <div className="flex-1 flex overflow-hidden">
            <NoteModal
              isOpen={true}
              isEditing={isEditing}
              newTitle={newTitle}
              newContent={newContent}
              newLabels={newLabels}
              availableLabels={availableLabels}
              setNewTitle={setNewTitle}
              setNewContent={setNewContent}
              addLabel={addLabel}
              removeLabel={removeLabel}
              addNote={addNote}
              closeModal={() => {
                setShowEditor(false);
                setNewTitle("");
                setNewContent("");
                setNewLabels([]);
                setIsEditing(false);
                setEditId(null);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={openModalForNewNote}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-teal-500/50 hover:scale-110 transition-all duration-300 z-50"
        title="New Note (Ctrl+M)"
      >
        <Plus size={28} />
      </button>

      {/* Bulk Actions Bar */}
      {selectedNotes.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedNotes.size}
          onDelete={handleBulkDelete}
          onArchive={handleBulkArchive}
          onStar={handleBulkStar}
          onExport={handleBulkExport}
          onClear={() => setSelectedNotes(new Set())}
        />
      )}

      {/* Modals */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportJSON={handleExportJSON}
        onExportMarkdown={handleExportMarkdown}
        onImport={handleImport}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={hideToast} />
      
      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
      />
    </div>
  );
}
