import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { getMyFriendRequest, getUserListRequest, postFriendRequest } from "../../apis"; // API 요청 함수
import "./style.css"; // 스타일 파일
import { GetMyFriendResponseDto, GetUserListResponseDto } from "../../apis/response/user";
import { ResponseDto } from "../../apis/response";
import { useCookies } from "react-cookie";
import { UserList } from "../../types/interface";

export default function MyFriendDialog({ onClose }: { onClose: () => void }) {
    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();
    const [myFriends, setMyFriends] = useState<UserList[]>([]); // 검색 결과 상태

    // function: 서버 응답 처리 함수 //
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

        const { userList } = responseBody as GetUserListResponseDto;
        setMyFriends(userList || []);
        
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

    return (
        <div className="dialog-overlay">
        <div className="dialog">
            <div className="dialog-header">
            <h2>나의 친구 목록</h2>
            <button className="close-button" onClick={onClose}>
                ✕
            </button>
            </div>
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
                    </div>
                ))}
                {myFriends.length === 0 && (
                    <p>친구가 없습니다.</p>
                )}
                </div>
            </div>
        </div>
        </div>
    );
}
