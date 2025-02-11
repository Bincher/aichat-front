import { Friends, UserList } from "../../../types/interface";
import ResponseDto from "../Response.dto";

export default interface GetMyFriendResponseDto extends ResponseDto{
    friends: UserList[];
}