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

  }

  const startChat = () => {
    if (username.trim() !== "" && roomId.trim() !== "") {
      setIsChatActive(true);
    }
  };

  // effect: accessToken cookie 값이 변경될 때 마다 실행할 함수 //
  useEffect(()=>{
    if(!cookies.accessToken){
      resetLoginUser();
      return;
    }
  },[cookies.accessToken])

  return (

      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={MY_CHAT_PATH()} element={<MyChat />} />
          <Route path={USER_PATH("bincher")} element={<Main />} />
          <Route path={CHAT_PATH(1)} element={<Main />} />
          <Route path={CHAT_DETAIL_PATH(1)} element={<Main />} />
          <Route path='*'  element={<h1>404 Not Found</h1>}/>
        </Route>
      </Routes>

  );
};

    // <div style={{ padding: "20px" }}>
    //   {!isChatActive ? (
    //     <div>
    //       <h2>Enter Chat Room</h2>
    //       <input
    //         type="text"
    //         placeholder="Enter your username"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //         style={{ marginBottom: "10px", display: "block" }}
    //       />
    //       <input
    //         type="text"
    //         placeholder="Enter room ID"
    //         value={roomId}
    //         onChange={(e) => setRoomId(e.target.value)}
    //         style={{ marginBottom: "10px", display: "block" }}
    //       />
    //       <button onClick={startChat}>Join Chat</button>
    //     </div>
    //   ) : (
    //     <ChatRoom roomId={roomId} username={username} />
    //   )}
    // </div>

export default App;
