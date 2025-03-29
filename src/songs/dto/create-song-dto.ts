import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime, IsNumber } from 'class-validator';
import { Artist } from 'src/artists/entities/artist.entity';
export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    // @IsNotEmpty()
    // @IsString({each: true})
    // readonly artists: string[];


    // this will get the artist id not artist
    @IsNotEmpty()
    @IsNumber({},{each: true})
    readonly artists: Artist[]; // id của artist, không phải tên artist

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