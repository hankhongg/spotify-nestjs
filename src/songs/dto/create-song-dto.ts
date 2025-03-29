import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime } from 'class-validator';
export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsString({each: true})
    readonly artists: string[];

    @IsNotEmpty()
    @IsString()
    readonly album: string;
    
    @IsNotEmpty()
    @IsDateString() // chỉ hoạt động với kiểu String
    readonly releasedDate: string;

    @IsNotEmpty()
    @IsMilitaryTime()
    readonly duration: string;

    @IsString()
    readonly lyrics: string;
}