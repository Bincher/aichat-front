import React, { useEffect, useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import useLoginUserStore from './stores/login-user.store';
import { useCookies } from 'react-cookie';

import Container from './layouts/Container';
import { AUTH_PATH, CHAT_DETAIL_PATH, CHAT_PATH, MAIN_PATH, MY_CHAT_PATH, USER_PATH } from './constant';
import Main from './views/Main';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './layouts/Header';
import Authentication from './views/Authentication';
import MyChat from './views/MyChat';
import { ResponseDto } from './apis/response';
import { GetSignInUserResponseDto } from './apis/response/user';
import { User } from './types/interface';
import { GetSignInUserRequest } from './apis';
import UserProfile from './views/UserProfile';


//   component: Application 컴포넌트   //
function App() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  // state: 로그인 유저 전역 상태 //
  const {setLoginUser, resetLoginUser} = useLoginUserStore();

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function: get sign in user response 처리 함수 //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'AF' || code === 'NU' || code === "DBE"){
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...(responseBody as GetSignInUserResponseDto)};
    setLoginUser(loginUser);
  }

  // effect: accessToken cookie 값이 변경될 때 마다 실행할 함수 //
  useEffect(()=>{
    if(!cookies.accessToken){
      resetLoginUser();
      return;
    }
    GetSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  },[cookies.accessToken])

  return (

      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={MY_CHAT_PATH()} element={<MyChat />} />
          <Route path={USER_PATH()} element={<UserProfile />} />
          <Route path={CHAT_PATH(':chatRoomId')} element={<ChatRoom/>} />
        </Route>
        <Route path='*'  element={<h1>404 Not Found</h1>}/>
      </Routes>

  );
};

export default App;
