import React, { useState, useEffect, useRef } from "react";
import { Message, ChatRoomProps } from "../../types/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLoginUserStore } from "../../stores";
import "./style.css"; 
import { gptFactCheckRequest, gptOrthographyRequest, gptRecommendTextRequest, gptSummaryRequest } from "../../apis";
import { GptFactCheckResponseDto, GptOrthographyResponseDto, GptRecommendTextResponseDto, GptSummaryResponseDto } from "../../apis/response/gpt";
import { ResponseDto } from "../../apis/response";

const ChatRoom: React.FC = () => {

    // state: chatRoomId param //
    const { chatRoomId } = useParams<{ chatRoomId: string }>();

    // state: 메시지 목록 상태 //
    const [messages, setMessages] = useState<Message[]>([]);

    // state: 입력 상태 //
    const [inputValue, setInputValue] = useState<string>("");

    // state: 웹소켓 //
    const websocketRef = useRef<WebSocket | null>(null);

    // state: ai 비서 옵션 선택 클릭 상태 //
    const [showOptions, setShowOptions] = useState<boolean>(false);

    // 로그인 유저 상태 //
    const { loginUser } = useLoginUserStore();

    // state: 메시지 목록 요소 참조 상태 //
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // function: gptFactCheck 처리 함수 //
    const gptFactCheckResponse = (responseBody: GptFactCheckResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NP") {
            alert("AI와의 연결 과정에서 문제가 발생하였습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code === "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            return;
        }

        const { correctedText, originalText } = responseBody as GptFactCheckResponseDto;
        alert(correctedText + originalText);
    };

    // function: gptOrthography 처리 함수 //
    const gptOrthographyResponse = (responseBody: GptOrthographyResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NP") {
            alert("AI와의 연결 과정에서 문제가 발생하였습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code === "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            return;
        }

        const { correctedText, originalText } = responseBody as GptOrthographyResponseDto;
        alert(correctedText + originalText);
    };

    // function: gptSummary 처리 함수 //
    const gptSummaryResponse = (responseBody: GptSummaryResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        console.log(responseBody);
        const { code } = responseBody;

        if (code == "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            alert("오류가 발생하였습니다.");
            return;
        }

        const { recommendedText } = responseBody as GptSummaryResponseDto;
        alert(recommendedText);
    };

    // function: gptRecommendText 처리 함수 //
    const gptRecommendTextResponse = (responseBody: GptRecommendTextResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        console.log(responseBody);
        const { code } = responseBody;

        if (code == "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            alert("오류가 발생하였습니다.");
            return;
        }

        const { recommendedText } = responseBody as GptRecommendTextResponseDto;
        alert(recommendedText);
    };

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

    const handleAIAction = async (actionType: string) => {
        try {
            let requestBody;

            switch (actionType) {
                case "orthography":
                    requestBody = {
                        prompt : `'${inputValue}'은(는) 어법과 맞춤법이 올바름?`
                    }
            
                    gptOrthographyRequest(requestBody).then(gptOrthographyResponse);
                    break;
                case "factCheck":
                    requestBody = {
                        prompt : `'${inputValue}'은(는) 사실인지 검증해줘`
                    }
                    gptFactCheckRequest(requestBody).then(gptFactCheckResponse);
                    break;
                case "summary":
                    if(chatRoomId == null) return;
                    requestBody = {
                        roomId : chatRoomId
                    }
                    gptSummaryRequest(requestBody).then(gptSummaryResponse);
                    break;
                case "recommendedText":
                    if(chatRoomId == null) return;
                    if(loginUser?.nickname == null) return;
                    const userNickname = loginUser?.nickname;
                    requestBody = {
                        roomId : chatRoomId,
                        nickname : userNickname
                    }
                    gptRecommendTextRequest(requestBody).then(gptRecommendTextResponse);
                    break;
                default:
                    console.error("이벤트 처리 과정 문제가 발생하였습니다. 관리자에게 문의해주세요.");
            }
        } catch (error) {
            console.error("클릭 과정에서 문제가 발생하였습니다. 다음 에러와 함께 관리자에게 문의해주세요.", error);
        }
    };
    
    const handleFactCheck = async (messageContent: string) => {

        const requestBody = {
            prompt : `'${messageContent}'은(는) 사실인지 검증해줘`
        }

        gptFactCheckRequest(requestBody).then(gptFactCheckResponse);
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
                        <button
                            className="fact-check-button"
                            onClick={() => handleFactCheck(msg.content)}
                        >
                            🕵️‍♂️ Fact Check
                        </button>
                    </div>
                ))}
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
                <div className="ai-assistant-container">
                    <button onClick={() => setShowOptions(!showOptions)}>AI Assistant</button>
                    {showOptions && (
                        <ul className="ai-options">
                            <li onClick={() => handleAIAction("orthography")}>맞춤법 검사</li>
                            <li onClick={() => handleAIAction("factCheck")}>팩트 체크</li>
                            <li onClick={() => handleAIAction("summary")}>채팅 내용 요약</li>
                            <li onClick={() => handleAIAction("recommendedText")}>상황에 맞는 추천 답변</li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
    

export default ChatRoom;
