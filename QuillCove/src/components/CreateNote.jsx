import React, { useState } from "react";

function CreateNote(props) {
  const [titleText, setTitleText] = useState("");
  const [contextText, setContextText] = useState("");

  function Onchange(event) {
    const { name, value } = event.target;
    name === "title" ? setTitleText(value) : setContextText(value);
  }

  return (
    <div>
      <form className="create-note">
        <input
          name="title"
          placeholder="Title"
          value={titleText}
          onChange={Onchange}
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          rows="3"
          value={contextText}
          onChange={Onchange}
        />
        <button
          type="submit"
          onClick={() => {
            event.preventDefault();
            props.onclick(titleText, contextText);
            setTitleText("");
            setContextText("");
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
