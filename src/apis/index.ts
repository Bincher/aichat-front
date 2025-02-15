import axios from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import ResponseDto from "./response/Response.dto";
import GetChatRoomListResponseDto from "./response/auth/get-chat-room-list.response.dto";
import { DeleteFriendResponseDto, GetInviteFriendResponseDto, GetMyFriendResponseDto, GetUserListResponseDto, PatchFriendResponseDto } from "./response/friend";
import { PostFriendRequestDto } from "./request/friend";
import PostFriendResponseDto from "./response/friend/post-friend.response.dto";
import PatchFriendRequestDto from "./request/friend/patch-friend.response.dto";
import { GetSignInUserResponseDto, GetUserResponseDto } from "./response/user";
import { ChatRoomInformationRequestDto, CreateChatRoomRequestDto } from "./request/chat";
import { ChatRoomInformationResponseDto, CreateChatRoomResponseDto } from "./response/chat";
import { GptFactCheckRequestDto, GptOrthographyRequestDto, GptRecommendTextRequestDto, GptSummaryRequestDto } from "./request/gpt";
import { GptFactCheckResponseDto, GptOrthographyResponseDto, GptRecommendTextResponseDto, GptSummaryResponseDto } from "./response/gpt";
import { GetUserRequestDto } from "./request/user";

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
const GET_USER_LIST_URL =(nickname : String)=> `${API_DOMAIN}/friend/${nickname}`;
const POST_FRIEND_URL =()=> `${API_DOMAIN}/friend/request`;
const GET_MY_FRIEND_URL =()=> `${API_DOMAIN}/friend/myfriend`;
const GET_INVITE_FRIEND_URL =()=> `${API_DOMAIN}/friend/invite`;
const PATCH_FRIEND_URL =()=> `${API_DOMAIN}/friend/response`;
const DELETE_FRIEND_URL =(nickname : String)=> `${API_DOMAIN}/friend/drop/${nickname}`;
const GET_SIGN_IN_USER_URL =()=> `${API_DOMAIN}/user`;
const CREATE_CHAT_ROOM_URL =()=> `${API_DOMAIN}/chat/chat-room/create`;
const GPT_ORTHOGRAPHY_URL =()=> `${API_DOMAIN}/gpt/orthography`;
const GPT_FACT_CHECK_URL =()=> `${API_DOMAIN}/gpt/fact-check`;
const GPT_RECOMMEND_TEXT_URL =()=> `${API_DOMAIN}/gpt/recommend-text`;
const GPT_SUMMARY_URL =()=> `${API_DOMAIN}/gpt/summary`;
// const GET_CHAT_HISTORY_URL =(chatRoomId : String)=> `${API_DOMAIN}/chat/history${chatRoomId}`;
const CHAT_ROOM_INFORMATION_URL =()=> `${API_DOMAIN}/chat/chat-room/this`
const GET_USER_URL =()=> `${API_DOMAIN}/user/other`

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

export const getUserListRequest = async (accessToken: string, nickname : string) =>{
    const result = await axios.get(GET_USER_LIST_URL(nickname), authorization(accessToken))
        .then(response => {
            console.log(nickname);
            const responseBody: GetUserListResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postFriendRequest = async (accessToken: string, requestBody: PostFriendRequestDto) =>{
    const result = await axios.post(POST_FRIEND_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostFriendResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getMyFriendRequest = async (accessToken: string) =>{
    const result = await axios.get(GET_MY_FRIEND_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetMyFriendResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getInviteFriendRequest = async (accessToken: string) =>{
    const result = await axios.get(GET_INVITE_FRIEND_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetInviteFriendResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchFriendRequest = async (accessToken: string, requestBody: PatchFriendRequestDto) =>{
    const result = await axios.patch(PATCH_FRIEND_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchFriendResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteFriendRequest = async (accessToken: string, nickname: string) =>{
    const result = await axios.delete(DELETE_FRIEND_URL(nickname), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteFriendResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const GetSignInUserRequest = async (accessToken: string) =>{
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response =>{
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const createChatRoomRequest = async (accessToken: string, requestBody: CreateChatRoomRequestDto) =>{
    const result = await axios.post(CREATE_CHAT_ROOM_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: CreateChatRoomResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const gptOrthographyRequest = async (requestBody: GptOrthographyRequestDto) =>{
    const result = await axios.post(GPT_ORTHOGRAPHY_URL(), requestBody)
        .then(response =>{
            const responseBody: GptOrthographyResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const gptFactCheckRequest = async (requestBody: GptFactCheckRequestDto) =>{
    const result = await axios.post(GPT_FACT_CHECK_URL(), requestBody)
        .then(response =>{
            const responseBody: GptFactCheckResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const gptRecommendTextRequest = async (requestBody: GptRecommendTextRequestDto) =>{
    const result = await axios.post(GPT_RECOMMEND_TEXT_URL(), requestBody)
        .then(response =>{
            const responseBody: GptRecommendTextResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const gptSummaryRequest = async (requestBody: GptSummaryRequestDto) =>{
    const result = await axios.post(GPT_SUMMARY_URL(), requestBody)
        .then(response =>{
            const responseBody: GptSummaryResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const chatRoomInformationRequest = async (accessToken: string, requestBody: ChatRoomInformationRequestDto) =>{
    const result = await axios.post(CHAT_ROOM_INFORMATION_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: ChatRoomInformationResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const getUserRequest = async (accessToken: string, requestBody: GetUserRequestDto) =>{
    const result = await axios.post(GET_USER_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 
