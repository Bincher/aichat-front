import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { getInviteFriendRequest, getMyFriendRequest, getUserListRequest, postFriendRequest } from "../../apis"; // API 요청 함수
import "./style.css"; // 스타일 파일
import { GetInviteFriendResponseDto, GetMyFriendResponseDto, GetUserListResponseDto } from "../../apis/response/user";
import { ResponseDto } from "../../apis/response";
import { useCookies } from "react-cookie";
import { UserList } from "../../types/interface";

export default function InviteDialog({ onClose }: { onClose: () => void }) {
    // state: 쿠키 상태 //
    const [cookies] = useCookies();
    const [myUsers, setMyUsers] = useState<UserList[]>([]); // 요청 목록 상태

    // function: 서버 응답 처리 함수 //
    const getInviteFriendResponse = (responseBody: GetInviteFriendResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NU") {
            alert("해당 사용자의 정보를 불려올 수 없습니다.");
            return;
        }
        if (code !== "SU") {
            alert("검색 중 오류가 발생했습니다.");
            return;
        }

        const { friends } = responseBody as GetInviteFriendResponseDto;
        setMyUsers(friends || []);
    };

    // event handler: 수락 버튼 클릭 //
    const onAcceptClickHandler = (nickname: string) => {
        alert(`${nickname}님의 요청을 수락했습니다.`);
        // TODO: 수락 API 호출 로직 추가
    };

    // event handler: 거절 버튼 클릭 //
    const onRejectClickHandler = (nickname: string) => {
        alert(`${nickname}님의 요청을 거절했습니다.`);
        // TODO: 거절 API 호출 로직 추가
    };

    // effect: 마운트 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            alert("인증 과정에서 문제가 발생하였습니다.");
            return;
        }

        getInviteFriendRequest(accessToken).then(getInviteFriendResponse);
    }, [cookies.accessToken]);

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-header">
                    <h2>요청 목록</h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="dialog-body">
                    <div className="friend-results">
                        {myUsers.map((user, index) => (
                            <div key={index} className="user-card">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="user-icon" />
                                ) : (
                                    <div className="icon-box">
                                        <div className="icon default-profile-icon"></div>
                                    </div>
                                )}
                                <span className="user-nickname">{user.nickname}</span>
                                <div className="action-buttons">
                                    <button
                                        className="accept-button"
                                        onClick={() => onAcceptClickHandler(user.nickname)}
                                    >
                                        수락
                                    </button>
                                    <button
                                        className="reject-button"
                                        onClick={() => onRejectClickHandler(user.nickname)}
                                    >
                                        거절
                                    </button>
                                </div>
                            </div>
                        ))}
                        {myUsers.length === 0 && (
                            <p>요청이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
