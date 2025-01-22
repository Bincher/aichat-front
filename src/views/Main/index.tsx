import { useNavigate } from "react-router-dom";
import './style.css';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    const navigate = useNavigate();

    // 버튼 클릭 시 이동할 경로 설정
    const handleStartClick = () => {
        navigate('/auth'); // '/start'를 원하는 경로로 변경하세요
    };

    return (
        <div className='main-wrapper'>
            <div className='main-container'>
                <h1 className='main-title'>당신의 채팅, AI 비서가 도와줄께요</h1>
                <h2 className='subtitle'>지금 무료로 채팅 with AI 비서 서비스를 이용해보세요</h2>
                <button className='startButton' onClick={handleStartClick}>
                    시작하기
                </button>
            </div>
        </div>
    );
}