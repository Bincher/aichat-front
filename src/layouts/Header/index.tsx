import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect} from 'react'
import useLoginUserStore from '../../stores/login-user.store';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AUTH_PATH, CHAT_DETAIL_PATH, CHAT_PATH, MAIN_PATH, MY_CHAT_PATH, USER_PATH } from '../../constant';
import './style.css';

// component: 헤더 레이아웃 //
export default function Header() {

    // state: 로그인 유저 상태 //
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

    // state: path 상태 //
    const {pathname} = useLocation();

    // state: cookie 상태 //
    const [cookies, setCookie] = useCookies();

    // state: 로그인 상태 //
    const [isLogin, setLogin] = useState<boolean>(false);

    // state: 인증 페이지 상태 //
    const [isAuthPage, setAuthPage] = useState<boolean>(false);

    // state: 메인 페이지 상태 //
    const [isMainPage, setMainPage] = useState<boolean>(false);

    // state: 채팅 페이지 상태 //
    const [isMyChatPage, setIsMyChatPage] = useState<boolean>(false);

    // state: 유저 페이지 상태 //
    const [isUserPage, setUserPage] = useState<boolean>(false);

    // function: 네비게이트 함수 //
    const navigate = useNavigate();

    // event handler: 로고 클릭 이벤트 처리 함수 //
    const onLogoClickHandler =()=>{
        navigate(MAIN_PATH());
    }

    // component: 로그인 또는 마이페이지 버튼 컴포넌트 //
    const MyPageButton =()=>{

        // state: userEmail path variable 상태 //
        const {userEmail} = useParams();
    
        // event handler: 마이페이지 버튼 클릭 이벤트 처리 함수 //
        const onMyPageButtonClickHandler =()=>{
            navigate(USER_PATH());
        }
    
        // event handler: 로그아웃 버튼 클릭 이벤트 처리 함수 //
        const onSignOutButtonClickHandler =()=>{
            resetLoginUser();
            setCookie('accessToken','',{path: MAIN_PATH(),expires: new Date()});
            navigate(MAIN_PATH());
        }
    
        // event handler: 로그인 버튼 클릭 이벤트 처리 함수 //
        const onSignInButtonClickHandler=()=>{
            navigate(AUTH_PATH());
        }
    
        // render: 로그아웃 버튼 컴포넌트 렌더링 //
        if(isLogin && userEmail === loginUser?.email)
        return(
            <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
        )
        // render: 마이페이지 버튼 컴포넌트 렌더링 //
        if(isLogin)
        return(
            <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
        )
        // render: 로그인 버튼 컴포넌트 렌더링 //
        return(
            <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
        )
    }

    // effect: path가 변경될 때 마다 실행될 함수 //
    useEffect(() => {
        const isAuthPage = pathname.startsWith(AUTH_PATH());
        setAuthPage(isAuthPage);
        const isMainPage = pathname === MAIN_PATH();
        setMainPage(isMainPage);
        const isUserPage = pathname.startsWith(USER_PATH());
        setUserPage(isUserPage);
        const isMyChatPage = pathname === MY_CHAT_PATH();
        setIsMyChatPage(isMyChatPage);
    }, [pathname] )

    // effect: login user가 변경될 때 마다 실행될 함수 //
    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser])

    // render: 헤더 레이아웃 렌더링 //
    return (
        <div id='header'>
            <div className='header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box'>
                        <div className='icon chat-bot-icon'></div>
                    </div>
                    <div className='header-logo'>{'CHAT with AI secretary'}</div>
                </div>
                <div className='header-right-box'>
                    {(isMainPage || isUserPage || isMyChatPage) && <MyPageButton/>}
                </div>
            </div>
        </div>
    )
}