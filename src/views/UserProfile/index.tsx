import { useEffect, useState } from "react";
import { User } from "../../types/interface";
import { useCookies } from "react-cookie";
import axios from "axios";
import './style.css';
import { GetSignInUserRequest } from "../../apis";
import { GetSignInUserResponseDto } from "../../apis/response/user";
import { ResponseDto } from "../../apis/response";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../constant";
import { useLoginUserStore } from "../../stores";

// component: 메인 화면 컴포넌트 //
export default function UserProfile() {

    const navigate = useNavigate();

    // state: 로그인 유저 상태 //
    const {loginUser, resetLoginUser} = useLoginUserStore();

    // state: 유저 정보 상태 //
    const [user, setUser] = useState<User | null>(null);

    // state: 쿠키 상태 //
    const [cookies, setCookie] = useCookies(["accessToken"]); 

    // function: 서버 응답 처리 함수 //
    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
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
        setUser(responseBody as GetSignInUserResponseDto);
    };

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 함수 //
    const onSignOutButtonClickHandler =()=>{
        resetLoginUser();
        setCookie('accessToken','',{path: MAIN_PATH(),expires: new Date()});
        navigate(MAIN_PATH());
    }

    // 사용자 정보 가져오기 //
    const fetchUserInfo = async () => {
        const accessToken = cookies.accessToken;

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            GetSignInUserRequest(accessToken).then(getSignInUserResponse);
        } catch (error) {
            console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            alert("사용자 정보를 가져오는 데 실패했습니다.");
        }
    };

    // effect: 사용자 정보 가져오기 //
    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (!user) {
        return <div>Loading...</div>; // 사용자 정보 로딩 중
    }

    // render: mychat 페이지 렌더링 //
    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
            {user.profileImage ? (
                                        <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="user-icon" />
                                    ) : (
                                        <div className="icon-box">
                                            <div className="icon default-profile-icon"></div>
                                        </div>
                                    )}
                <h1>{user.nickname}</h1>
            </div>
            <div className="user-profile-info">
                <p>
                <strong>Email:</strong> {user.email}
                </p>
                <p>
                <strong>Phone Number:</strong> {user.phoneNumber}
                </p>
            </div>
            <button className="logout-button" onClick={onSignOutButtonClickHandler}>
                로그아웃
            </button>
        </div>
    );
}