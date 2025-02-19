"use client";

import { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import Background from "@/components/Background";
import Note from "@/components/Note";
import NoteModal from "@/components/NoteModal";
import SpotlightNote from "@/components/SpotlightNote";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setNotes(userData.notes || []);
          setAvailableLabels(userData.labels || []);
        }
      } else {
        router.push("/auth");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const saveUserData = async (updatedNotes: NoteType[], updatedLabels: string[]) => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      await setDoc(
        userDoc,
        { notes: updatedNotes, labels: updatedLabels },
        { merge: true }
      );
    }
  };

  const openModalForNewNote = () => {
    setNewTitle("");
    setNewContent("");
    setNewLabels([]);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const addNote = async () => {
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
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    await saveUserData(updatedNotes, availableLabels);
  };

  const editNote = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      setNewTitle(note.title);
      setNewContent(note.content);
      setNewLabels(note.labels);
      setIsEditing(true);
      setEditId(id);
      setIsModalOpen(true);
    }
  };

  const viewNote = (note: NoteType) => {
    setSpotlightNote(note);
  };

  const toggleStar = async (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, starred: !note.starred } : note
    );
    setNotes(
      updatedNotes.sort((a, b) => Number(b.starred) - Number(a.starred))
    );
    await saveUserData(updatedNotes, availableLabels);
  };

  const addLabel = async (label: string) => {
    let updatedLabels = availableLabels;
    if (!availableLabels.includes(label)) {
      updatedLabels = [...availableLabels, label];
      setAvailableLabels(updatedLabels);
    }
    if (!newLabels.includes(label)) {
      setNewLabels([...newLabels, label]);
    }
    await saveUserData(notes, updatedLabels);
  };

  const deleteLabel = async (label: string) => {
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
  };

  const getNotesByLabel = (label: string) => {
    return notes.filter((note) => note.labels.includes(label));
  };

  const filteredNotes = notes.filter(
    (note) =>
      note &&
      note.title &&
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen grid grid-rows-[60px_100px_auto_60px] max-h-screen p-4">
      <Background />
      <header>
        <div className="h-[60px] bg-black/10 backdrop-blur-md text-center text-white text-4xl font-bold z-10 max-w-6xl mx-auto rounded-lg">
          <h1 className="pt-2">QuillCove</h1>
        </div>
      </header>
      <div className="relative h-[100px] text-2xl font-bold text-white mb-4 text-center p-4 z-10 max-w-6xl mx-auto rounded-lg w-full">
        Welcome to QuillCove
        <div className="absolute bottom-1 right-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 text-sm bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search notes..."
            />
            <Search className="absolute top-2 right-2 text-white" size={20} />
          </div>
        </div>
      </div>
      <main className="overflow-y-auto p-8 max-h-[calc(100vh-250px)] z-10">
        <div className="w-full max-w-4xl mx-auto">
          {notes.length === 0 ? (
            <div className="text-white text-center">
              Click on the <Plus size={24} className="inline" /> icon to create
              your first note.
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-4">
                Starred Notes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredNotes
                  .filter((note) => note.starred)
                  .map((note) => (
                    <Note
                      key={note.id}
                      note={note}
                      editNote={editNote}
                      deleteNote={deleteNote}
                      toggleStar={toggleStar}
                      viewNote={viewNote}
                    />
                  ))}
              </div>
              {availableLabels.map((label, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{label}</h2>
                    <button
                      onClick={() => deleteLabel(label)}
                      className="text-white bg-red-600 p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {getNotesByLabel(label).map((note) => (
                      <Note
                        key={note.id}
                        note={note}
                        editNote={editNote}
                        deleteNote={deleteNote}
                        toggleStar={toggleStar}
                        viewNote={viewNote}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <h2 className="text-xl font-bold text-white mb-4">Notes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes
                  .filter((note) => !note.starred && note.labels.length === 0)
                  .map((note) => (
                    <Note
                      key={note.id}
                      note={note}
                      editNote={editNote}
                      deleteNote={deleteNote}
                      toggleStar={toggleStar}
                      viewNote={viewNote}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
        <button
          onClick={openModalForNewNote}
          className="fixed bottom-20 right-16 p-4 bg-white/40 text-white rounded-full shadow-lg hover:bg-white/50 transition-colors z-50"
        >
          <Plus size={24} />
        </button>
      </main>
      <footer>
        <div className="h-[60px] bg-black/10 backdrop-blur-md text-center text-white font-bold z-10 max-w-6xl mx-auto rounded-lg">
          <p className="pt-4">© 2025 QuillCove. All rights reserved.</p>
        </div>
      </footer>

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
