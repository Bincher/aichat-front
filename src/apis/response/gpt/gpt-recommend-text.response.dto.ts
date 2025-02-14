import ResponseDto from "../Response.dto";

export default interface GptRecommendTextResponseDto extends ResponseDto{
    recommendText: string;
    roomId: string;
}