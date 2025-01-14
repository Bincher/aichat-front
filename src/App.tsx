import React, { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const startChat = () => {
    if (username.trim() !== "" && roomId.trim() !== "") {
      setIsChatActive(true);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isChatActive ? (
        <div>
          <h2>Enter Chat Room</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px", display: "block" }}
          />
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ marginBottom: "10px", display: "block" }}
          />
          <button onClick={startChat}>Join Chat</button>
        </div>
      ) : (
        <ChatRoom roomId={roomId} username={username} />
      )}
    </div>
  );
};

export default App;
