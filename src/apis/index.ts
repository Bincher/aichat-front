import axios from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import ResponseDto from "./response/Response.dto";
import GetChatRoomListResponseDto from "./response/auth/get-chat-room-list.response.dto";

const DOMAIN = 'http://localhost:8090';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization =(accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}

const ID_CHECK_URL =()=> `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/check-certification`;
const SIGN_IN_URL =()=> `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL =()=> `${API_DOMAIN}/auth/sign-up`;
const GET_CHAT_ROOM_LIST_URL =()=> `${API_DOMAIN}/chat/chat-room`;

export const idCheckRequest = async (requestBody: IdCheckRequestDto)=>{
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(response =>{
            const responseBody: IdCheckResponseDto = response.data;
            return responseBody;
        })
        .catch(error=>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto)=>{
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(response =>{
            const responseBody: EmailCertificationResponseDto = response.data;
            return responseBody;
        })
        .catch(error=>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto)=>{
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(response =>{
            const responseBody: CheckCertificationResponseDto = response.data;
            return responseBody;
        })
        .catch(error=>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto)=>{
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response =>{
            const responseBody:SignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error=>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const signInRequest = async (requestBody: SignInRequestDto)=>{
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response =>{
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getChatRoomListRequest = async (accessToken: string) =>{
    const result = await axios.get(GET_CHAT_ROOM_LIST_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetChatRoomListResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}