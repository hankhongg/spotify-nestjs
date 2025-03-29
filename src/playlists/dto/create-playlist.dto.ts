import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlaylistDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    
    // cứ có join column là có foreign key aka id => thật ra là bỏ vào hết!
    @IsNotEmpty()
    @IsNumber()
    readonly user: number; // id của user, không phải tên user

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    readonly songs: number[]; // id của song, không phải tên song
}
