import { User } from "../../../types/interface";
import ResponseDto from "../Response.dto";

export default interface GetUserResponseDto extends ResponseDto{
    nickname : string;
    profileImage: null;
    friend: boolean;
}