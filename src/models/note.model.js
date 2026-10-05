import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tommorow_tasks: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);