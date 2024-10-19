import express from "express";
import {
  addNote,
  getNotes,
  editNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/add", addNote);
router.get("/:userId", getNotes);
router.put("/edit/:noteId", editNote);
router.delete("/delete", deleteNote);

export default router;
