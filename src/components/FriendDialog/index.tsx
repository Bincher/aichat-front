import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { getUserListRequest, postFriendRequest } from "../../apis"; // API 요청 함수
import "./style.css"; // 스타일 파일
import { GetUserListResponseDto } from "../../apis/response/friend";
import { ResponseDto } from "../../apis/response";
import { useCookies } from "react-cookie";
import { UserList } from "../../types/interface";
import PostFriendResponseDto from "../../apis/response/friend/post-friend.response.dto";

export default function AddFriendDialog({ onClose }: { onClose: () => void }) {

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // state: 검색한 닉네임 상태 //
    const [nickname, setNickname] = useState<string>("");

    // state: 검색한 유저 목록 상태 //
    const [searchResults, setSearchResults] = useState<UserList[]>([]);

    // state: 로딩 상태 //
    const [loading, setLoading] = useState<boolean>(false);

    // function: getUsetList 처리 함수 //
    const getUserListResponse = (responseBody: GetUserListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NU") {
            alert("사용자의 정보를 불려올 수 없습니다. 재로그인 후 시도해주세요");
            return;
        }
        if (code === "DBE") {
            alert("데이터베이스 오류입니다.");
            return;
        }
        if (code !== "SU") {
            setLoading(false);
            alert("검색 중 오류가 발생했습니다.");
            return;
        }

        const { userList } = responseBody as GetUserListResponseDto;
        setSearchResults(userList);

        setLoading(false);
        
    };

    // function: postFriend 처리 함수 //
    const postFriendResponse = (responseBody: PostFriendResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === "NU") {
            alert("사용자의 정보를 불려올 수 없습니다. 재로그인 후 시도해주세요");
            return;
        }
        if (code === "DBE") {
            alert("데이터베이스 오류입니다.");
            return;
        }
        if (code === "EF") {
            alert("이미 친구인 유저입니다.");
            return;
        }
        if(code === "DU"){
            alert("이미 친구 초대를 보냈습니다.");
            return;
        }
        if (code !== "SU") {
            setLoading(false); 
            alert("검색 중 오류가 발생했습니다.");
            return;
        }

        alert("친구 요청을 보냈습니다.");
        
    };

    // event handler: 닉네임 입력 변경 이벤트 처리 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    };

    // event handler: 검색 버튼 클릭 또는 엔터 키 입력 이벤트 처리 //
    const onSearchButtonClickHandler = async () => {
        if (!nickname.trim()) return; // 빈 입력 방지
        setLoading(true); // 로딩 시작
        const accessToken = cookies.accessToken;
        if (!accessToken){
            alert("사용자 인증 과정에서 문제가 발생하였습니다. 재로그인 후 다시 시도해주세요");
            return;
        }
        const userNickname = nickname;
        getUserListRequest(accessToken, userNickname).then(getUserListResponse);
        
    };

    // event handler: 아랫키 입력 이벤트 처리 //
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") onSearchButtonClickHandler();
    };

    // event handler: 친구 추가 버튼 클릭 이벤트 처리 //
    const onAddFriendButtonClickHandler =(friendNickname: string)=>{
        const accessToken = cookies.accessToken;
        if (!accessToken){
            alert("사용자 인증 과정에서 문제가 발생하였습니다. 재로그인 후 다시 시도해주세요");
            return;
        }
        const requestBody = { nickname: friendNickname };
        postFriendRequest(accessToken, requestBody).then(postFriendResponse);
    }

    // render: 친구 추가 다디얼로그 렌더링 //
    return (
        <div className="dialog-overlay">
        <div className="dialog">
            <div className="dialog-header">
            <h2>친구 추가</h2>
            <button className="close-button" onClick={onClose}>
                ✕
            </button>
            </div>
            <div className="dialog-body">
            <div className="search-bar">
                <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={onNicknameChangeHandler}
                onKeyDown={onKeyDownHandler}
                />
                <button className="search-button" onClick={onSearchButtonClickHandler}>
                🔍
                </button>
            </div>
            {loading ? ( 
                <div className="loading">검색 중...</div>
            ) : (
                <div className="search-results">
                {searchResults.map((user, index) => (
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
                            className="invite-button"
                            onClick={() => onAddFriendButtonClickHandler(user.nickname)} // 해당 유저의 닉네임 전달
                        >
                            친구 초대 요청
                        </button>
                    </div>
                ))}
                {searchResults.length === 0 && !loading && (
                    <p>검색 결과가 없습니다.</p>
                )}
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
