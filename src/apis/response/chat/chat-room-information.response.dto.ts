import { ChatRoom, ChatRoomUsers, UserList } from "../../../types/interface";
import ResponseDto from "../Response.dto";

export default interface ChatRoomInformationResponseDto extends ResponseDto{
    chatRoom : ChatRoom
}