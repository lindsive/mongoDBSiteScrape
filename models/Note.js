const mongoose = require("mongoose");

// save a reference to the Schema constructor
const Schema = mongoose.Schema;

// a NoteSchema constructor that uses the Schema constructor to create a NoteSchema object
const NoteSchema = new Schema({
    title: String,
    body: String
});

// creates model from tthe NoteSchema using mongooses model method
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;