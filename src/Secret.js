import './css/Secret.css';
import {Redirect,useHistory} from 'react-router-dom';
import Strava from './Strava.js';
import React, { useState } from 'react'

const Secret = () => {
  const history = useHistory();
  const [inputValue, setInputValue] = useState("");
  const handleUserInput = (e) => {
    setInputValue(e.target.value);
  };
  const secretFunction = (e) => {
    let secretPassphrase = e.target.elements.secret.value;
    if (secretPassphrase == "strava") {
      history.push("/strava");
    } else {
      e.preventDefault();
      setInputValue("");
    }
  }
  return (
    <div className="Secret">
      <h1>Secret Page</h1>
      <p>shhhhhhhhhhhhhhhhhhh</p>
      <form method="post" onSubmit={secretFunction}>
        <input type="text" value={inputValue} onChange={handleUserInput} name="secret" />
        <input type="submit" value="submit" />
      </form>
      {/* 
        All of the secret code is hidden, not posting the secret stuff on github like a fool
      */}
    </div>
  );
}

export default Secret;
