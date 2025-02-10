import UserList from "./user-list.interface";

// 각 채팅방의 정보를 나타내는 타입
interface ChatRoomInformation {
    chatRoomId: number;
    roomName: string;
    users: UserList[]; // 채팅방에 소속된 유저 목록
}

// 서버로부터 전달받는 전체 응답의 타입
export default interface ChatRoomUsers {
    code: string; // 응답 코드 (예: "SU")
    message: string; // 응답 메시지 (예: "Success")
    chatRooms: ChatRoomInformation[]; // 채팅방 목록
}