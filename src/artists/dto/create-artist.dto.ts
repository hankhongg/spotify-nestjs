import { IsInt, IsNotEmpty } from "class-validator";

export class CreateArtistDto {
    @IsNotEmpty()
    readonly user: number; // id của user, không phải tên user
    @IsNotEmpty()
    readonly artistName: string; // tên artist
}
