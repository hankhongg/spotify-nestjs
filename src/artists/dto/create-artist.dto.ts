import { IsInt, IsNotEmpty } from "class-validator";

export class CreateArtistDto {
    @IsNotEmpty()
    @IsInt()
    readonly userId: number; // id của user, không phải tên user
}
