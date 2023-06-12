import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { number } from "yup";

const initialState = {
    notes: [],
    status: "idle",
    error: null
};

export const fetchNotes = createAsyncThunk("note/fetchNotes", async () => {
    const response = await axios.get("http://localhost:9000/notes");
    return response.data;
});

export const addNote = createAsyncThunk("note/addNote", async (newnote) => {
    const response = await axios.post("http://localhost:9000/create_note", newnote);
    return response.data;
});

export const editNote = createAsyncThunk("note/editNote", async ({noteId, updatedNote}) => {
    const response = await axios.put(`http://localhost:9000/update_note/${noteId}`,
    updatedNote);
    return response.data;
});

export const deletNote = createAsyncThunk("note/deletNote", async (noteId) => {
    await axios.delete(`http://localhost:9000/delete_note/${noteId}`);
    return noteId;
});

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchNotes.pending, (state) => {
            state.status = "loading";
            state.error = null;
        }).addCase(fetchNotes.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.notes = action.payload;
        }).addCase(fetchNotes.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        }).addCase(addNote.fulfilled, (state, action) => {
            state.notes.push(action.payload);
        }).addCase(editNote.fulfilled, (state, action) => {
            const {id,title,content} = action.payload;
            const existingNote = state.notes.find((note) => note.id ===Number(id));
            if (existingNote) {
                existingNote.title = title;
                existingNote.content = content;
               
               
            }
        }).addCase(deletNote.fulfilled, (state, action) => {
            const noteId = action.payload;
            state.notes = state.notes.filter((note) => note.id !== noteId);
        });
        
    }
});

export default noteSlice.reducer;