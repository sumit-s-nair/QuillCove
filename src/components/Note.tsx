import { Edit, Trash, Star } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import React, { JSX } from "react";

interface NoteProps {
  note: { title: string; content: string; starred: boolean; labels: string[] };
  index: number;
  moveNote: (fromIndex: number, toIndex: number) => void;
  editNote: (index: number) => void;
  deleteNote: (index: number) => void;
  toggleStar: (index: number) => void;
  viewNote: (note: {
    title: string;
    content: string;
    labels: string[];
  }) => void;
}

const ItemType = "NOTE";

export default function Note({
  note,
  index,
  moveNote,
  editNote,
  deleteNote,
  toggleStar,
  viewNote,
}: NoteProps): JSX.Element {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveNote(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        ref(node);
        drop(node);
      }}
      className="p-4 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-md h-auto flex flex-col justify-between cursor-pointer"
      onClick={() => viewNote(note)}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-white mb-2">{note.title}</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStar(index);
          }}
          className="text-white"
        >
          {note.starred ? <Star fill="currentColor" /> : <Star />}
        </button>
      </div>
      <p className="text-white mb-4">
        {note.content.length > 20
          ? note.content.substring(0, 20) + "..."
          : note.content}
      </p>
      <div className="flex justify-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            editNote(index);
          }}
          className="p-2 bg-blue-900/60 text-white rounded-lg hover:bg-blue-900/80 transition-colors flex items-center"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(index);
          }}
          className="p-2 bg-red-900/60 text-white rounded-lg hover:bg-red-900/80 transition-colors flex items-center"
        >
          <Trash size={16} />
        </button>
      </div>
      <div className="flex flex-wrap mt-2">
        {note.labels.map((label, idx) => (
          <span
            key={idx}
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded mr-2 mb-2"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
