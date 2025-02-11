import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { deleteFriendRequest, getMyFriendRequest, getUserListRequest, postFriendRequest } from "../../apis"; // API 요청 함수
import "./style.css"; // 스타일 파일
import { DeleteFriendResponseDto, GetMyFriendResponseDto, GetUserListResponseDto } from "../../apis/response/friend";
import { ResponseDto } from "../../apis/response";
import { useCookies } from "react-cookie";
import { UserList } from "../../types/interface";
import InviteDialog from "../InviteDialog";

export default function MyFriendDialog({ onClose }: { onClose: () => void }) {

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // state: 친구 검색 결과 목록 상태 //
    const [myFriends, setMyFriends] = useState<UserList[]>([]);

    // state: 친구 추가 다이얼로그 표시 상태 //
    const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false);

    // function: getMyFriend 처리 함수 //
    const getMyFriendResponse = (responseBody: GetMyFriendResponseDto | ResponseDto | null) => {
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

        const { friends } = responseBody as GetMyFriendResponseDto;
        console.log("Parsed userList:", friends);
        setMyFriends(friends || []); // 상태 업데이트
        
    };

    // function: deleteFriend 처리 함수 //
    const deleteFriendResponse = (responseBody: DeleteFriendResponseDto | ResponseDto | null, userNickname: string) => {
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

        setMyFriends((prevFriends) =>
            prevFriends.filter((friend) => friend.nickname !== userNickname)
        );
        alert("삭제가 완료되었습니다.");
        
    };

    // event handler: 아이디 변경 이벤트 처리 //
    const onInviteButtonClickHandler =()=>{
        setShowInviteDialog(true);
    }

    // event handler: 친구 삭제 버튼 클릭 이벤트 처리 //
    const onRemoveFriendClickHandler = (nickname: string) => {
        if (!nickname.trim()) return;

        const accessToken = cookies.accessToken;
        if (!accessToken){
            alert("인증 과정에서 문제가 발생하였습니다.");
            return;
        }

        const userNickname = nickname;
        deleteFriendRequest(accessToken, userNickname).then((response) =>
            deleteFriendResponse(response, userNickname)
        );
        
    };

    // effect: 마운트 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken){
            alert("인증 과정에서 문제가 발생하였습니다.");
            return;
        }

        getMyFriendRequest(accessToken).then(getMyFriendResponse);
    }, [cookies.accessToken]);

    // render: MyFriendDialog 친구 목록 다이얼로그 렌더링 //
    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-header">
                    <h2>나의 친구 목록</h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <button className="request-button" onClick={onInviteButtonClickHandler}>
                    요청 목록 보기
                </button>
                <div className="dialog-body">
                    <div className="friend-results">
                        {myFriends.map((user, index) => (
                            <div key={index} className="user-card">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="user-icon" />
                                ) : (
                                    <div className="icon-box">
                                        <div className="icon default-profile-icon"></div>
                                    </div>
                                )}
                                <span className="user-nickname">{user.nickname}</span>
                                <button
                                    className="remove-friend-button"
                                    onClick={() => onRemoveFriendClickHandler(user.nickname)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {myFriends.length === 0 && (
                            <p>친구가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
            {showInviteDialog && (
                <InviteDialog onClose={() => setShowInviteDialog(false)} />
            )}
        </div>
    );
}
