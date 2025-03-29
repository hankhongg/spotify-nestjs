import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime, IsOptional } from 'class-validator';
export class UpdateSongDTO{
    @IsString()
    @IsOptional() // không bắt buộc phải có trong request body
    readonly title: string;

    @IsOptional()
    @IsString({each: true})
    readonly artists: string[];

    @IsOptional()
    @IsString()
    readonly album: string;
    
    @IsOptional()
    @IsDateString() // chỉ hoạt động với kiểu String
    readonly releasedDate: string;

    @IsOptional()
    @IsMilitaryTime()
    readonly duration: string;

    @IsString()
    readonly lyrics: string;
}