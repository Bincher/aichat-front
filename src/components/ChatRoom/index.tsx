import React, { useState, useEffect, useRef } from "react";
import { Message, ChatRoomProps } from "../../types/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLoginUserStore } from "../../stores";
import "./style.css"; 

const ChatRoom: React.FC = () => {

    // state: chatRoomId param //
    const { chatRoomId } = useParams<{ chatRoomId: string }>();

    // state: 메시지 목록 상태 //
    const [messages, setMessages] = useState<Message[]>([]);

    // state: 입력 상태 //
    const [inputValue, setInputValue] = useState<string>("");

    // state: 웹소켓 //
    const websocketRef = useRef<WebSocket | null>(null);

    // 로그인 유저 상태 //
    const { loginUser } = useLoginUserStore();

    // state: 메시지 목록 요소 참조 상태 //
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // effect: MongoDB에서 채팅 내역 불러오기
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get<Message[]>(
                    `http://localhost:8090/api/v1/chat/history/${chatRoomId}`
                );
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };

        fetchChatHistory();
    }, [chatRoomId]);

    // WebSocket 연결 설정
    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8090/ws/chat");
        websocketRef.current = websocket;

        websocket.onopen = () => {
            console.log("WebSocket connected");
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        websocket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [messages]);

    // event handler: 메시지 전송 버튼 클릭 이벤트 //
    const sendMessageButtonClickHandler = () => {
        if (inputValue.trim() !== "" && websocketRef.current) {
            const messageData = {
                roomId: chatRoomId,
                sender: loginUser?.nickname,
                content: inputValue,
                timestamp: new Date().toISOString(),
            };
            websocketRef.current.send(JSON.stringify(messageData));
            setInputValue("");
        }
    };

    // event handler: Enter 키 입력 이벤트 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessageButtonClickHandler();
        }
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room-header">
                <h2>Chat Room {chatRoomId}</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.sender}</strong>: {msg.content}{" "}
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} /> 
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessageButtonClickHandler}>Send</button>
            </div>
        </div>
    );
};
    

export default ChatRoom;
