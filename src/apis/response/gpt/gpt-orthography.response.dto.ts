import ResponseDto from "../Response.dto";

export default interface GptOrthographyResponseDto extends ResponseDto{
    correctedText: string;
    originalText: string;
}