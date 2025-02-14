import ResponseDto from "../Response.dto";

export default interface GptRecommendTextResponseDto extends ResponseDto{
    recommendedText: string;
    roomId: string;
}