import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime } from 'class-validator';
export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsString({each: true})
    readonly artist: string[];

    @IsNotEmpty()
    @IsString()
    readonly album: string;
    
    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: Date;

    @IsNotEmpty()
    @IsMilitaryTime()
    readonly duration: Date;
}