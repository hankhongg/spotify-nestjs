import { IsNotEmpty, IsString } from "class-validator";

export class ValidateTokenDto {
    @IsNotEmpty()
    @IsString()
    token: string; // the token to be validated
}