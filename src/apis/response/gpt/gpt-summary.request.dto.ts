import ResponseDto from "../Response.dto";

export default interface GptSummaryResponseDto extends ResponseDto{
    recommendedText: string;
    roomId: string;
}