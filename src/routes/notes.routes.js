import express from 'express'
import { createNote, deleteNote, updateNote } from '../controller/note.controller.js'

const note_router = express.Router()
note_router.post('/create-note',createNote)
note_router.put('/update-note/:id',updateNote)
note_router.delete('/delete-note:id',deleteNote)

export default note_router