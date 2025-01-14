import React, { useState, useEffect, useRef } from "react";
import { Message, ChatRoomProps } from "../../types/types";
import axios from "axios";

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, username }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 채팅 메시지 리스트
    const [inputValue, setInputValue] = useState<string>(""); // 입력 필드 값
    const websocketRef = useRef<WebSocket | null>(null); // WebSocket 참조
    
    

    // MongoDB에서 채팅 내역 불러오기
    useEffect(() => {
        

        const fetchChatHistory = async () => {
            try {
            const response = await axios.get<Message[]>(
                `http://localhost:8090/api/chat/history/${roomId}`
            );
            setMessages(response.data);
            } catch (error) {
            console.error("Failed to fetch chat history:", error);
            }
        };
    
        fetchChatHistory();
        }, [roomId]);
    
        // WebSocket 연결 설정
        useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8090/ws/chat");
        websocketRef.current = websocket;
    
        websocket.onopen = () => {
            console.log("WebSocket connected");
        };
    
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data); // JSON 형식으로 수신된 메시지 파싱
            setMessages((prevMessages) => [...prevMessages, data]);
            websocket.onmessage = (event) => {
                console.log("Message received from server:", event.data);
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };
        };
    
        websocket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    
        return () => {
            if (websocketRef.current) {
            websocketRef.current.close(); // 컴포넌트 언마운트 시 WebSocket 연결 종료
            }
        };
        }, []);
    
        // 메시지 전송 함수
        const sendMessage = () => {
            if (inputValue.trim() !== "" && websocketRef.current) {
                const messageData = {
                    roomId,
                    sender: username,
                    content: inputValue,
                    timestamp: new Date().toISOString(),
                };
                websocketRef.current.send(JSON.stringify(messageData)); // JSON 형식으로 전송
                setInputValue("");
                }
            };
    
        return (
        <div style={{ padding: "20px" }}>
            <h2>Chat Room</h2>
            <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px" }}>
            {messages.map((msg, index) => (
                <div key={index}>
                <strong>{msg.sender}</strong>: {msg.content}{" "}
                <span style={{ fontSize: "0.8em", color: "#888" }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
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
