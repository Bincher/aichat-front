import ResponseDto from "../Response.dto";

export default interface GptSummaryResponseDto extends ResponseDto{
    recommendText: string;
    roomId: string;
}