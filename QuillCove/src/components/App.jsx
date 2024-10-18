import React, {useState} from 'react'
import Header from "./Header"
import Footer from './Footer'
import Note from './Note'
import CreateNote from './CreateNote'

function App() {
  const [notes, setNotes] = useState([])

  class NoteItem {
    constructor(title, content) {
      this.title = title
      this.content = content
    }
  }

  function createCard(item, index) {
    return <Note key={index} title={item.title} content={item.content} id = {index} onclick = {deleteNote}/>;
  }

  function addItem(titleText, contextText){
    const note = new NoteItem(titleText, contextText);
    setNotes((prevItems) => {
      return [...prevItems, note]
    })
  }

  function deleteNote(id){
    setNotes ((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id
      })
    })
  }

  return (
    <div className="app-container">
      <Header />
      <CreateNote onclick = {addItem}/>
      <div className="notes-container">
        {notes.map(createCard)}
      </div>
      <Footer />
    </div>
  );
}

export default App
