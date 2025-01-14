// types.ts
export interface Message {
    sender: string;
    content: string;
    timestamp: string; // ISO-8601 형식
}
    
export interface ChatRoomProps {
    roomId: string; // 채팅방 ID
    username: string; // 사용자 이름
}