import React, { useState, useEffect } from "react";
import { createChatRoomRequest, getMyFriendRequest } from "../../apis"; // API 요청 함수
import "./style.css"; // 스타일 파일
import { GetMyFriendResponseDto } from "../../apis/response/friend";
import { useCookies } from "react-cookie";
import { UserList } from "../../types/interface";
import { ResponseDto } from "../../apis/response";
import { CreateChatRoomRequestDto } from "../../apis/request/chat";
import CreateChatRoomResponseDto from "../../apis/response/chat/create-chat-room.response.dto";

export default function CreateChatRoomDialog({ onClose }: { onClose: () => void }) {
    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // state: 채팅방 이름 //
    const [roomName, setRoomName] = useState<string>("");

    // state: 친구 목록 상태 //
    const [myFriends, setMyFriends] = useState<UserList[]>([]);

    // state: 검색어 상태 //
    const [searchTerm, setSearchTerm] = useState<string>("");

    // state: 선택된 친구 목록 상태 //
    const [selectedUsers, setSelectedUsers] = useState<UserList[]>([]);

    // function: getMyFriend 처리 함수 //
    const getMyFriendResponse = (responseBody: GetMyFriendResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NU") {
            alert("해당 사용자의 정보를 불러올 수 없습니다.");
            return;
        }
        if (code !== "SU") {
            alert("친구 목록을 가져오는 중 오류가 발생했습니다.");
            return;
        }

        const { friends } = responseBody as GetMyFriendResponseDto;
        setMyFriends(friends || []); // 친구 목록 상태 업데이트
    };

    // function: createChatRoom 처리 함수 //
    const createChatRoomResponse = (responseBody: CreateChatRoomResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "SU") {
            alert("채팅방이 성공적으로 생성되었습니다.");
            onClose(); // 다이얼로그 닫기
        } else {
            alert("채팅방 생성 중 오류가 발생했습니다.");
        }

        onClose();
    };

    // event handler: 채팅방 이름 변경 이벤트 처리 //
    const onRoomNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value);
    };

    // event handler: 친구 선택 이벤트 처리 //
    const onSelectUserHandler = (user: UserList) => {
        if (selectedUsers.some((selectedUser) => selectedUser.nickname === user.nickname)) {
            // 이미 선택된 경우 제거
            setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.nickname !== user.nickname));
        } else {
            // 선택되지 않은 경우 추가
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // event handler: 검색어 변경 //
    const onSearchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // event handler: 생성 버튼 클릭 이벤트 처리 //
    const onCreateButtonClickHandler = async () => {
        if (!roomName.trim()) {
            alert("채팅방 이름을 입력해주세요.");
            return;
        }

        if (selectedUsers.length === 0) {
            alert("참여할 유저를 선택해주세요.");
            return;
        }

        const accessToken = cookies.accessToken;
        if (!accessToken) {
            alert("인증 과정에서 문제가 발생하였습니다.");
            return;
        }

        const requestBody: CreateChatRoomRequestDto = {
            roomName,
            userNicknames: selectedUsers.map((user) => user.nickname), // 선택된 유저 닉네임 배열
        };
        console.log(requestBody);

        createChatRoomRequest(accessToken, requestBody).then(createChatRoomResponse);
        
    };

    // effect: 마운트 시 친구 목록 가져오기 //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            alert("인증 과정에서 문제가 발생하였습니다.");
            return;
        }

        getMyFriendRequest(accessToken).then(getMyFriendResponse);
    }, [cookies.accessToken]);

    // filter : 친구 검색 필터링 //
    const filteredFriends = myFriends.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-header">
                    <h2>채팅방 생성</h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="dialog-body">

                    <div className="input-group">
                        <label htmlFor="room-name">채팅방 이름</label>
                        <input
                            id="room-name"
                            type="text"
                            placeholder="채팅방 이름을 입력하세요"
                            value={roomName}
                            onChange={onRoomNameChangeHandler}
                        />
                    </div>

                    {/* 검색 입력 */}
                    <div className="input-group">
                        <label htmlFor="search-friends">친구 검색</label>
                        <input
                            id="search-friends"
                            type="text"
                            placeholder="친구를 검색하세요"
                            value={searchTerm}
                            onChange={onSearchChangeHandler}
                        />
                    </div>

                    {/* 친구 목록 */}
                    <div className="friend-list scrollable">
                        <h3>참여할 유저 추가하기</h3>
                        {filteredFriends.map((friend, index) => (
                            <div key={index} className={`friend-item ${selectedUsers.some((user) => user.nickname === friend.nickname) ? "selected" : ""}`} onClick={() => onSelectUserHandler(friend)}>
                                {friend.profileImage ? (
                                    <img src={friend.profileImage} alt={`${friend.nickname} 프로필`} className="friend-icon" />
                                ) : (
                                    <div className="icon-box">
                                        <div className="icon default-profile-icon"></div>
                                    </div>
                                )}
                                <span className="friend-nickname">{friend.nickname}</span>
                            </div>
                        ))}
                        {filteredFriends.length === 0 && <p>검색 결과가 없습니다.</p>}
                    </div>

                    {/* 선택된 친구 목록 */}
                    <div className="selected-users">
                        <h3>선택된 유저</h3>
                        {selectedUsers.map((user, index) => (
                            <div key={index} className="selected-user-item">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="friend-icon" />
                                ) : (
                                    <div className="icon-box">
                                        <div className="icon default-profile-icon"></div>
                                    </div>
                                )}
                                <span className="friend-nickname">{user.nickname}</span>
                            </div>
                        ))}
                        {selectedUsers.length === 0 && <p>선택된 유저가 없습니다.</p>}
                    </div>

                    {/* 생성 버튼 */}
                    <button className="create-button" onClick={onCreateButtonClickHandler}>
                        생성
                    </button>
                </div>
            </div>
        </div>
    );
}
