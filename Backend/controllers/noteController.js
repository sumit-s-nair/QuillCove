import User from "../models/userModel.js";

export const addNote = async (req, res) => {
  const { userId, title, content } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.notes.push({ title, content });
    await user.save();
    res.status(201).json({ message: "Note added", notes: user.notes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotes = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editNote = async (req, res) => {
  const { userId, title, content } = req.body;
  const { noteId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const note = user.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title;
    note.content = content;

    await user.save();
    res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { userId, noteId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find and remove the note by ID
    const noteIndex = user.notes.findIndex(
      (note) => note._id.toString() === noteId
    );
    if (noteIndex !== -1) {
      user.notes.splice(noteIndex, 1);
      await user.save();
      res.status(200).json({ message: "Note deleted", notes: user.notes });
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
