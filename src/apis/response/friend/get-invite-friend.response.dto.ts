import { UserList } from "../../../types/interface";
import ResponseDto from "../Response.dto";

export default interface GetInviteFriendResponseDto extends ResponseDto{
    friends: UserList[];
}