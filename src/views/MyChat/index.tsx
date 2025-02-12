import { useNavigate } from "react-router-dom";
import { useLoginUserStore } from "../../stores";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { MAIN_PATH } from "../../constant";
import { getChatRoomListRequest } from "../../apis";
import GetChatRoomListResponseDto from "../../apis/response/auth/get-chat-room-list.response.dto";
import { ResponseDto } from "../../apis/response";
import './style.css';
import AddFriendDialog from "../../components/FriendDialog";
import MyFriendDialog from "../../components/MyFriendDialog";
import CreateChatRoomDialog from "../../components/CreateChatRoomDialog";
import ChatRoom from "../../components/ChatRoom";

// component: 메인 화면 컴포넌트 //
export default function MyChat() {

    const navigate = useNavigate();

    // // state: 로그인 유저 상태 //
    // const { loginUser } = useLoginUserStore();

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // state: 채팅방 목록 상태 //
    const [chatRooms, setChatRooms] = useState<GetChatRoomListResponseDto["chatRooms"]>([]);

    // state: 친구 추가 다이얼로그 표시 상태 //
    const [showAddFriendDialog, setShowAddFriendDialog] = useState<boolean>(false);

    // state: 친구 목록 다이얼로그 표시 상태 //
    const [showMyFriendDialog, setShowMyFriendDialog] = useState<boolean>(false);

    // state: 채팅 생성 다이얼로그 표시 상태 //
    const [showCreateChatRoomDialog, setShowCreateChatRoomDialog] = useState<boolean>(false);

    // function: 서버 응답 처리 함수 //
    const getChatRoomListResponse = (responseBody: GetChatRoomListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "DBE") {
            alert("데이터베이스 오류입니다.");
            return;
        }

        if (code !== "SU") {
            navigate(MAIN_PATH());
            return;
        }

        // chatRooms 데이터 가져오기 및 상태 저장
        const { chatRooms } = responseBody as GetChatRoomListResponseDto;
        setChatRooms(chatRooms);
    };

    // effect: 마운트 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken){
            alert("서비스를 이용하시려면 로그인이 필요합니다.");
            navigate(MAIN_PATH());
            return;
        }

        getChatRoomListRequest(accessToken).then(getChatRoomListResponse);
    }, [cookies.accessToken]);

    // event handler: 채팅방 카드 클릭 이벤트 처리 //
    const onChatRoomCardClickHandler = (roomId: number, userNickname: string) => {
        const roomIdString = roomId.toString();
        navigate(`/chatroom/${roomIdString}`);
    };

    // render: mychat 페이지 렌더링 //
    return (
        <div className="my-chat-wrapper">
            <div className="my-chat-header">
                <div className="my-chat-header-left">
                    <button className="chat-button" onClick={() => setShowCreateChatRoomDialog(true)}>
                        채팅 만들기
                    </button>
                    <button className="chat-button" onClick={() => setShowAddFriendDialog(true)}>
                        친구 추가
                    </button>
                    <button className="chat-button" onClick={() => setShowMyFriendDialog(true)}>
                        친구 목록
                    </button>
                </div>
                <div className="my-chat-header-right">
                    <button className="chat-button" onClick={() => alert("채팅 삭제 기능은 준비 중입니다.")}>
                        채팅 삭제
                    </button>
                </div>
            </div>
            <div className="my-chat-body">
                {chatRooms.map((chatRoom) => (
                    <div
                        key={chatRoom.chatRoomId}
                        className="chat-card"
                        onClick={() =>{
                            console.log("Card clicked:", chatRoom.chatRoomId)
                            onChatRoomCardClickHandler(chatRoom.chatRoomId, cookies.userNickname)
                        }
                        }
                    >
                        <h3>{chatRoom.roomName}</h3>
                        <p>참여 유저:</p>
                        <ul>
                            {chatRoom.users.map((user, index) => (
                                <div key={index} className="user-info">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="user-icon" />
                                    ) : (
                                        <div className="icon-box">
                                            <div className="icon default-profile-icon"></div>
                                        </div>
                                    )}
                                    <span className="user-nickname">{user.nickname}</span>
                                    {index !== chatRoom.users.length - 1 && <span className="separator"> / </span>}
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {showAddFriendDialog && (
                <AddFriendDialog onClose={() => setShowAddFriendDialog(false)} />
            )}
            {showMyFriendDialog && (
                <MyFriendDialog onClose={() => setShowMyFriendDialog(false)} />
            )}
            {showCreateChatRoomDialog && (
                <CreateChatRoomDialog onClose={() => setShowCreateChatRoomDialog(false)} />
            )}
        </div>
    );
}