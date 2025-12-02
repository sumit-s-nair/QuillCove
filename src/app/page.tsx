"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, LogOut, Menu } from "lucide-react";
import Background from "@/components/Background";
import ModernNote from "@/components/ModernNote";
import NoteModal from "@/components/NoteModal";
import SpotlightNote from "@/components/SpotlightNote";
import FilterTabs from "@/components/FilterTabs";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface NoteType {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  labels: string[];
}

export default function Home() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newLabels, setNewLabels] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spotlightNote, setSpotlightNote] = useState<NoteType | null>(null);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Notes");
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setNotes(userData.notes || []);
            setAvailableLabels(userData.labels || []);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const saveUserData = useCallback(async (updatedNotes: NoteType[], updatedLabels: string[]) => {
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

  const openModalForNewNote = useCallback(() => {
    setNewTitle("");
    setNewContent("");
    setNewLabels([]);
    setIsEditing(false);
    setIsModalOpen(true);
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
        const newNote: NoteType = {
          id: uuidv4(),
          title: newTitle,
          content: newContent,
          starred: false,
          labels: newLabels,
        };
        updatedNotes = [...notes, newNote];
      }
      setNotes(updatedNotes);
      await saveUserData(updatedNotes, availableLabels);
      setIsModalOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewLabels([]);
    }
  }, [newTitle, newContent, newLabels, isEditing, editId, notes, availableLabels, saveUserData]);

  const deleteNote = useCallback(async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, availableLabels);
  }, [notes, availableLabels, saveUserData]);

  const editNote = useCallback((id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      setNewTitle(note.title);
      setNewContent(note.content);
      setNewLabels(note.labels);
      setIsEditing(true);
      setEditId(id);
      setIsModalOpen(true);
    }
  }, [notes]);

  const viewNote = useCallback((note: NoteType) => {
    setSpotlightNote(note);
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

  const deleteLabel = useCallback(async (label: string) => {
    const updatedLabels = availableLabels.filter((l) => l !== label);
    const updatedNotes = notes.map((note) => {
      if (note.labels.includes(label)) {
        return { ...note, labels: note.labels.filter((l) => l !== label) };
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

  // Filtered notes based on search and active filter
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(
      (note) =>
        note &&
        note.title &&
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeFilter === "Starred") {
      filtered = filtered.filter((note) => note.starred);
    } else if (activeFilter !== "All Notes") {
      filtered = filtered.filter((note) => note.labels.includes(activeFilter));
    }

    return filtered;
  }, [notes, searchQuery, activeFilter]);

  const starredCount = useMemo(() => notes.filter(n => n.starred).length, [notes]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Background />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Background />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/50 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <Menu size={24} className="text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                QuillCove
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="Search notes..."
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <FilterTabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            availableLabels={availableLabels}
            noteCount={notes.length}
            starredCount={starredCount}
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              {searchQuery ? "No notes found" : "No notes yet"}
            </p>
            {!searchQuery && (
              <p className="text-gray-500 text-sm">
                Click the + button to create your first note
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filteredNotes.map((note) => (
              <ModernNote
                key={note.id}
                note={note}
                editNote={editNote}
                deleteNote={deleteNote}
                toggleStar={toggleStar}
                viewNote={viewNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={openModalForNewNote}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-50"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        newTitle={newTitle}
        newContent={newContent}
        newLabels={newLabels}
        availableLabels={availableLabels}
        setNewTitle={setNewTitle}
        setNewContent={setNewContent}
        addLabel={addLabel}
        addNote={addNote}
        closeModal={() => setIsModalOpen(false)}
      />

      <SpotlightNote
        note={spotlightNote}
        closeSpotlight={() => setSpotlightNote(null)}
      />
    </div>
  );
}
