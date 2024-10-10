import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { getInitialData, showFormattedDate } from "./utils/index.js";
import "./styles/style.css"; 

const App = () => {
  const [notes, setNotes] = useState(getInitialData());
  const [searchQuery, setSearchQuery] = useState("");
  
  const addNote = (title, body) => {
    setNotes([...notes, {
      id: +new Date(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const archiveNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="note-app__header">
        <h1>Personal Notes</h1>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearch}
          className="note-search"
        />
      </div>
      <NoteInput addNote={addNote} />
      <NoteList
        notes={filteredNotes.filter(note => !note.archived)}
        onDelete={deleteNote}
        onArchive={archiveNote}
        title="Active Notes"
      />
      <NoteList
        notes={filteredNotes.filter(note => note.archived)}
        onDelete={deleteNote}
        onArchive={archiveNote}
        title="Archived Notes"
      />
    </div>
  );
};

const NoteInput = ({ addNote }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [charLimit, setCharLimit] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.length > 50) return;
    addNote(title, body);
    setTitle("");
    setBody("");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setCharLimit(50 - e.target.value.length);
  };

  return (
    <form onSubmit={handleSubmit} className="note-input">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <div className="note-input__title__char-limit">
        {charLimit} characters left
      </div>
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

const NoteList = ({ notes, onDelete, onArchive, title }) => {
  if (notes.length === 0) {
    return <p className="notes-list__empty-message">No notes available</p>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div className="notes-list">
        {notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
};

const NoteItem = ({ note, onDelete, onArchive }) => {
  return (
    <div className="note-item">
      <h3 className="note-item__title">{note.title}</h3>
      <p className="note-item__body">{note.body}</p>
      <p className="note-item__date">{showFormattedDate(note.createdAt)}</p>
      <div className="note-item__action">
        <button onClick={() => onDelete(note.id)} className="note-item__delete-button">Delete</button>
        <button onClick={() => onArchive(note.id)} className="note-item__archive-button">
          {note.archived ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
