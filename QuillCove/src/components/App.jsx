import React from 'react'
import Header from "./Header"
import Footer from './Footer'
import Note from './Note'
import notes from '../notes'

function createCard(note) {
  return <Note key={note.id} title={note.title} content={note.content}/>;
}

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="notes-container">
        {notes.map(createCard)}
      </div>
      <Footer />
    </div>
  );
}

export default App
