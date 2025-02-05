import { useNavigate } from "react-router-dom";
import { useLoginUserStore } from "../../stores";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { MAIN_PATH } from "../../constant";
import { getChatRoomListRequest } from "../../apis";
import GetChatRoomListResponseDto from "../../apis/response/auth/get-chat-room-list.response.dto";
import { ResponseDto } from "../../apis/response";

// component: 메인 화면 컴포넌트 //
export default function MyChat() {

    const navigate = useNavigate();

    // state: 로그인 유저 상태 //
    const { loginUser } = useLoginUserStore();

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // function: 
    const getChatRoomListResponse =(responseBody: GetChatRoomListResponseDto | ResponseDto | null)=>{
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }
        // chatRooms 데이터 가져오기
        const { chatRooms } = responseBody as GetChatRoomListResponseDto;

        // chatRooms의 내용을 순회하며 처리
        chatRooms.forEach((chatRoom) => {
            console.log(`채팅방 ID: ${chatRoom.chatRoomId}`);
            console.log(`채팅방 이름: ${chatRoom.roomName}`);
            console.log('유저 목록:');
            chatRoom.users.forEach((user) => {
                console.log(`- 닉네임: ${user.nickname}`);
                console.log(`- 프로필 이미지: ${user.profileImage || '없음'}`);
            });
        });
    
    }

    // effect: 마운트 시 실행할 함수 //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken){
            navigate(MAIN_PATH());
            return;
        }

        getChatRoomListRequest(accessToken).then(getChatRoomListResponse);
    }, [cookies.accessToken]);

    return (
        <div className='main-wrapper'>
            <div className='main-container'>
                <h2 className='subtitle'>로그인 성공</h2>
            </div>
        </div>
    );
}