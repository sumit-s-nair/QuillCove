"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import Background from "@/components/Background";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Note from "@/components/Note";

export default function Home() {
  const [notes, setNotes] = useState<
    { title: string; content: string; starred: boolean; labels: string[] }[]
  >([]);
  const [newTitle, setNewTitle] = useState("New Title");
  const [newContent, setNewContent] = useState("New Content");
  const [newLabels, setNewLabels] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spotlightNote, setSpotlightNote] = useState<{
    title: string;
    content: string;
    labels: string[];
  } | null>(null);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addNote = () => {
    if (newTitle.trim() && newContent.trim()) {
      if (isEditing && editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = {
          title: newTitle,
          content: newContent,
          starred: notes[editIndex].starred,
          labels: newLabels,
        };
        setNotes(updatedNotes);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setNotes([
          ...notes,
          {
            title: newTitle,
            content: newContent,
            starred: false,
            labels: newLabels,
          },
        ]);
      }
      setIsModalOpen(false);
      setNewTitle("New Title");
      setNewContent("New Content");
      setNewLabels([]);
    }
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const editNote = (index: number) => {
    setNewTitle(notes[index].title);
    setNewContent(notes[index].content);
    setNewLabels(notes[index].labels);
    setIsEditing(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const viewNote = (note: {
    title: string;
    content: string;
    labels: string[];
  }) => {
    setSpotlightNote(note);
  };

  const toggleStar = (index: number) => {
    const updatedNotes = [...notes];
    updatedNotes[index].starred = !updatedNotes[index].starred;
    setNotes(
      updatedNotes.sort((a, b) => Number(b.starred) - Number(a.starred))
    );
  };

  const moveNote = (fromIndex: number, toIndex: number) => {
    const updatedNotes = [...notes];
    const [movedNote] = updatedNotes.splice(fromIndex, 1);
    updatedNotes.splice(toIndex, 0, movedNote);
    setNotes(updatedNotes);
  };

  const addLabel = (label: string) => {
    if (!availableLabels.includes(label)) {
      setAvailableLabels([...availableLabels, label]);
    }
    if (!newLabels.includes(label)) {
      setNewLabels([...newLabels, label]);
    }
  };

  const deleteLabel = (label: string) => {
    setAvailableLabels(availableLabels.filter((l) => l !== label));
    const updatedNotes = notes.map((note) => {
      if (note.labels.includes(label)) {
        return { ...note, labels: note.labels.filter((l) => l !== label) };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const getNotesByLabel = (label: string) => {
    return notes.filter((note) => note.labels.includes(label));
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
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
            <h2 className="text-xl font-bold text-white mb-4">Starred Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredNotes
                .filter((note) => note.starred)
                .map((note, index) => (
                  <Note
                    key={index}
                    note={note}
                    index={index}
                    moveNote={moveNote}
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
                  {getNotesByLabel(label).map((note, index) => (
                    <Note
                      key={index}
                      note={note}
                      index={index}
                      moveNote={moveNote}
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
                .map((note, index) => (
                  <Note
                    key={index}
                    note={note}
                    index={index}
                    moveNote={moveNote}
                    editNote={editNote}
                    deleteNote={deleteNote}
                    toggleStar={toggleStar}
                    viewNote={viewNote}
                  />
                ))}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
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

        {isModalOpen && (
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
                  onClick={() =>
                    isEditing ? setIsEditing(false) : setIsModalOpen(false)
                  }
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
        )}

        {spotlightNote && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-30">
            <div className="p-8 rounded-lg shadow-lg bg-white/20 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 max-w-md">
                {spotlightNote.title}
              </h2>
              <p className="text-lg mb-4 break-words">
                {spotlightNote.content}
              </p>
              <div className="flex flex-wrap mb-4">
                {spotlightNote.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-white text-xs px-2 py-1 rounded mr-2 mb-2"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSpotlightNote(null)}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
