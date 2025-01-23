import { ResponseCode } from "../../types/enum";

export default interface responseDto {
    code: ResponseCode;
    message: string;
}