// 각 유저의 정보를 나타내는 타입
interface ChatUser {
    nickname: string;
    profileImage: string | null; // 프로필 이미지가 없을 수도 있으므로 null 허용
}

// 서버로부터 전달받는 전체 응답의 타입
export default interface ChatRoom {
    chatRoomId: number;
    roomName: string;
    users: ChatUser[]; // 채팅방에 소속된 유저 목록
}