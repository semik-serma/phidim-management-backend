import { Note } from "../models/note.model.js";
import { errorResponse, successResponse } from "../utils/response.js";


export const createNote = async (req, res) => {
  try {
    const { title, content, tommorow_tasks } = req.body;

    if (!title || !content || !tommorow_tasks) {
      return errorResponse(res, "please enter all the fields", 400);
    }

    const create_note = await Note.create({
      title,
      content,
      tommorow_tasks,
    });

    return successResponse(res, "successfully created a note", 200, {
      note: create_note,
    });
  } catch (error) {
    console.log("error at note controller");
    return errorResponse(res, "error at note controller", 500, error);
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tommorow_tasks } = req.body;

    if (!title && !content && !tommorow_tasks) {
      return errorResponse(res, "please provide at least one field to update", 400);
    }

    const updated_note = await Note.findByIdAndUpdate(
      id,
      { title, content, tommorow_tasks },
      { new: true, runValidators: true }
    );

    if (!updated_note) {
      return errorResponse(res, "note not found", 404);
    }

    return successResponse(res, "note updated successfully", 200, {
      note: updated_note,
    });
  } catch (error) {
    console.log("error at update note controller");
    return errorResponse(res, "error at update note controller", 500, error);
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted_note = await Note.findByIdAndDelete(id);

    if (!deleted_note) {
      return errorResponse(res, "note not found", 404);
    }

    return successResponse(res, "note deleted successfully", 200, {
      note: deleted_note,
    });
  } catch (error) {
    console.log("error at delete note controller");
    return errorResponse(res, "error at delete note controller", 500, error);
  }
};
