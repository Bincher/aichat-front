import React, { useState, useEffect, useRef } from "react";
import { Message, ChatRoomProps } from "../../types/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLoginUserStore } from "../../stores";
import "./style.css"; 
import { chatRoomInformationRequest, gptFactCheckRequest, gptOrthographyRequest, gptRecommendTextRequest, gptSummaryRequest } from "../../apis";
import { GptFactCheckResponseDto, GptOrthographyResponseDto, GptRecommendTextResponseDto, GptSummaryResponseDto } from "../../apis/response/gpt";
import { ResponseDto } from "../../apis/response";
import { ChatRoomInformationResponseDto } from "../../apis/response/chat";
import { UserList } from "../../types/interface";
import { useCookies } from "react-cookie";

const ChatRoom: React.FC = () => {

    // state: chatRoomId param //
    const { chatRoomId } = useParams<{ chatRoomId: string }>();

    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // state: 메시지 목록 상태 //
    const [messages, setMessages] = useState<Message[]>([]);

    // state: 입력 상태 //
    const [inputValue, setInputValue] = useState<string>("");

    // state: 웹소켓 //
    const websocketRef = useRef<WebSocket | null>(null);

    // state: ai 비서 옵션 선택 클릭 상태 //
    const [showOptions, setShowOptions] = useState<boolean>(false);

    // state: ai 비서 응답 상태 //
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    // state: 채팅방 이름 상태 //
    const [chatRoomName, setChatRoomName] = useState<string>("");

    // state: 유저 정보 상태 //
    const [users, setUsers] = useState<UserList[]>([]); 

    // state: 로딩 상태 //
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 로그인 유저 상태 //
    const { loginUser } = useLoginUserStore();

    // state: 메시지 목록 요소 참조 상태 //
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // function: chatRoomInformation 처리 함수 //
    const chatRoomInformationResponse = (responseBody: ChatRoomInformationResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            alert("오류가 발생하였습니다.");
            return;
        }

        const { chatRoom } = responseBody as ChatRoomInformationResponseDto;
        
        setChatRoomName(chatRoom.roomName);
        setUsers(chatRoom.users);
        
    };

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
        setAiResponse(`팩트 체크 결과: ${correctedText}`);
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
        setAiResponse(`맞춤법 검사 결과: ${correctedText}`);
    };

    // function: gptSummary 처리 함수 //
    const gptSummaryResponse = (responseBody: GptSummaryResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            alert("오류가 발생하였습니다.");
            return;
        }

        const { recommendedText } = responseBody as GptSummaryResponseDto;
        setAiResponse(`채팅 요약: ${recommendedText}`);
    };

    // function: gptRecommendText 처리 함수 //
    const gptRecommendTextResponse = (responseBody: GptRecommendTextResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NR") {
            alert("적절한 데이터를 가져오지 못했습니다. 인터넷 확인 후 다시 시도해주세요");
        }
        if (code !== "SU") {
            alert("오류가 발생하였습니다.");
            return;
        }

        const { recommendedText } = responseBody as GptRecommendTextResponseDto;
        setAiResponse(`추천 답변: ${recommendedText}`);
    };

    // effect: MongoDB에서 채팅 내역 불러오기 //
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get<Message[]>(
                    `http://localhost:8090/api/v1/chat/history/${chatRoomId}`
                );
                setMessages(response.data);

                const requestBody = { chatRoomId };
                
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };

        fetchChatHistory();
        
    }, [chatRoomId]);

    // effect: 채팅방 정보 가져오기 //
    useEffect(() => {
        const fetchChatRoomInfo = async () => {
            try {
                if (chatRoomId) {
                    const requestBody = { chatRoomId };
                    const accessToken = cookies.accessToken;
                        if (!accessToken) {
                            alert("인증 과정에서 문제가 발생하였습니다.");
                            return;
                        }
                    await chatRoomInformationRequest(accessToken, requestBody).then(chatRoomInformationResponse);
                } else {
                    alert("chatRoomId가 유효하지 않습니다.");
                }
            } catch (error) {
                console.error("Failed to fetch chat room information:", error);
            }
        };
    
        fetchChatRoomInfo();
    }, [chatRoomId]);

    // effect: WebSocket 연결 설정
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

    // event handler: AI 비서 버튼 클릭 이벤트 해들러 //
    const AISecretaryButtonClickHandler = async (actionType: string) => {

        try {
            setIsLoading(true);
            let requestBody;

            switch (actionType) {
                case "orthography":
                    if(inputValue === ""){
                        alert("입력창에 메시지를 먼저 입력하셔야 합니다.");
                        return;
                    }
                    requestBody = {
                        prompt : `'${inputValue}'은(는) 어법과 맞춤법이 올바름?`
                    }
            
                    gptOrthographyRequest(requestBody).then(gptOrthographyResponse);
                    break;
                case "factCheck":
                    if(inputValue === ""){
                        alert("입력창에 메시지를 먼저 입력하셔야 합니다.");
                        return;
                    }
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
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };
    
    // event handler: 팩트 체크 클릭 이벤트 핸들러 //
    const factCheckEventClickHandler = async (messageContent: string) => {

        const requestBody = {
            prompt : `'${messageContent}'은(는) 사실인지 검증해줘`
        }

        gptFactCheckRequest(requestBody).then(gptFactCheckResponse);
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room-header">
                <h2>{chatRoomName || "Loading..."}</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const isMyMessage = msg.sender === loginUser?.nickname;
                    const userProfile = users.find((user) => user.nickname === msg.sender);

                    return (
                        <div
                            key={index}
                            className={`chat-message ${isMyMessage ? "my-message" : "other-message"}`}
                        >
                            {isMyMessage ? (
                                <>
                                    <button
                                        className="fact-check-button"
                                        onClick={() => factCheckEventClickHandler(msg.content)}
                                    >
                                        🕵️‍♂️ FactCheck
                                    </button>
                                    <span className="message-timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                    <div className="message-content">{msg.content}</div>
                                    <strong className="message-sender">{msg.sender}</strong>
                                    <div className="profile-container">
                                        {userProfile?.profileImage ? (
                                            <img
                                                src={userProfile.profileImage}
                                                alt={`${msg.sender}'s profile`}
                                                className="profile-image"
                                            />
                                        ) : (
                                            <div className="icon-box">
                                                <div className="icon default-profile-icon"></div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="profile-container">
                                        {userProfile?.profileImage ? (
                                            <img
                                                src={userProfile.profileImage}
                                                alt={`${msg.sender}'s profile`}
                                                className="profile-image"
                                            />
                                        ) : (
                                            <div className="icon-box">
                                                <div className="icon default-profile-icon"></div>
                                            </div>
                                        )}
                                    </div>
                                    <strong className="message-sender">{msg.sender}</strong>
                                    <div className="message-content">{msg.content}</div>
                                    <span className="message-timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                    <button
                                        className="fact-check-button"
                                        onClick={() => factCheckEventClickHandler(msg.content)}
                                    >
                                        🕵️‍♂️ FactCheck
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {aiResponse && (
                <div className="ai-response-popup">
                    <strong>AI 비서의 조언:</strong>
                    <p>{aiResponse}</p>
                    <button onClick={() => setAiResponse(null)}>닫기</button>
                </div>
            )}
            <div className="chat-input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={sendMessageButtonClickHandler}>Send</button>
                <div className="ai-assistant-container">
                <button
                    className="ai-assistant-button"
                    onClick={() => setShowOptions(!showOptions)}
                    disabled={isLoading} // 로딩 중에는 클릭 비활성화
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span> // 로딩 중일 때 표시
                    ) : (
                        "🤖 AI Secretary" // 기본 텍스트
                    )}
                </button>
                    {showOptions && (
                        <div className="ai-options-modal">
                            <ul>
                                <li onClick={() => AISecretaryButtonClickHandler("orthography")}>맞춤법 검사</li>
                                <li onClick={() => AISecretaryButtonClickHandler("factCheck")}>팩트 체크</li>
                                <li onClick={() => AISecretaryButtonClickHandler("summary")}>채팅 내용 요약</li>
                                <li onClick={() => AISecretaryButtonClickHandler("recommendedText")}>상황에 맞는 추천 답변</li>
                            </ul>
                            <button onClick={() => setShowOptions(false)}>닫기</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    );
};
    

export default ChatRoom;
