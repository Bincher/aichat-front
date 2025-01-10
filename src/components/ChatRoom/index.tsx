import React, { useState, useEffect, useRef } from "react";
import { Message } from "../../types/types";

interface ChatRoomProps {
  username: string; // 사용자 이름 전달
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 리스트 관리
    const [inputValue, setInputValue] = useState<string>(""); // 입력 필드 값 관리
    const websocketRef = useRef<WebSocket | null>(null); // WebSocket 참조

    // WebSocket 연결 설정
    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8090/ws/chat");
        websocketRef.current = websocket;

        // 메시지 수신 처리
        websocket.onmessage = (event: MessageEvent) => {
        const data = event.data;
        const [sender, content] = data.split(": ");
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender, content, timestamp: new Date().toLocaleTimeString() },
        ]);
        };

        // 연결 종료 처리
        websocket.onclose = () => {
        console.log("WebSocket connection closed");
        };

        return () => {
            websocket.close();
        };
    }, []);

    // 메시지 전송 함수
    const sendMessage = () => {
        if (inputValue.trim() !== "" && websocketRef.current) {
        const message = `${username}: ${inputValue}`;
        websocketRef.current.send(message);
        setInputValue("");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>Welcome to the Chat Room</h2>
        <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px" }}>
            {messages.map((msg, index) => (
            <div key={index}>
                <strong>{msg.sender}</strong>: {msg.content}{" "}
                <span style={{ fontSize: "0.8em", color: "#888" }}>{msg.timestamp}</span>
            </div>
            ))}
        </div>
        <div style={{ marginTop: "10px" }}>
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            style={{ width: "80%" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
            Send
            </button>
        </div>
        </div>
    );
};

export default ChatRoom;
