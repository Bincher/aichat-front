import { FriendUsers, UserList } from "../../../types/interface";
import ResponseDto from "../Response.dto";

export default interface GetUserListResponseDto extends ResponseDto{
    userList: UserList[];
}