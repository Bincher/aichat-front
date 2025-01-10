import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatRoom from './components/ChatRoom';
import axios from "axios";

function App() {
  const username = prompt("Enter your username:", "guest") || "guest";

  return (
    <div>
      <ChatRoom username={username} />
    </div>
  );
}

export default App;
