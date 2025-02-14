import ResponseDto from "../Response.dto";

export default interface GptFactCheckResponseDto extends ResponseDto{
    correctedText: string;
    originalText: string;
}