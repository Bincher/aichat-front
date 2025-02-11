import { useNavigate } from "react-router-dom";
import './style.css';
import { useLoginUserStore } from "../../stores";

// component: 메인 화면 컴포넌트 //
export default function Main() {

    const navigate = useNavigate();

    // state: 로그인 유저 상태 //
    const {loginUser} = useLoginUserStore();

    // event handler: 버튼 클릭 이벤트 핸들러 //
    const StartButtonClickHandler = () => {
        if(!loginUser) navigate('/auth'); // '/start'를 원하는 경로로 변경하세요
        else navigate('/mychat')
    };

    // Render: 메인 화면 렌더링 //
    return (
        <div className='main-wrapper'>
            <div className='main-container'>
                <h1 className='main-title'>당신의 채팅, AI 비서가 도와줄께요</h1>
                <h2 className='subtitle'>지금 무료로 채팅 with AI 비서 서비스를 이용해보세요</h2>
                <button className='startButton' onClick={StartButtonClickHandler}>
                    시작하기
                </button>
            </div>
        </div>
    );
}