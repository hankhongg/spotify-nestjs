import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime, IsOptional, IsNumber } from 'class-validator';
import { Artist } from 'src/artists/entities/artist.entity';
export class UpdateSongDTO{
    @IsString()
    @IsOptional() // không bắt buộc phải có trong request body
    readonly title: string;

    // @IsOptional()
    // @IsString({each: true})
    // readonly artists: string[];

    @IsOptional()
    @IsNumber({},{each: true})
    readonly artists: Artist[]; // id của artist, không phải tên artist

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