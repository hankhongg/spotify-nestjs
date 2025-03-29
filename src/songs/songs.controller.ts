import { Inject,Controller, Get, Post, Delete, Put, Param, ParseIntPipe, HttpStatus, HttpException, Body } from '@nestjs/common';
import { SongsService } from './songs.service';
import e from 'express';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService,
        @Inject('CONNECTION') private connection: Connection,
    ) {
        console.log(`This is DATABASE: ${connection.DATABASE}`);
    } // get CONNECTION aka the provider from the module then use the useValue
    
    // create
    @Post()
    create(@Body() createSongDTO: CreateSongDTO) : Promise<Song> { // use the DTO to validate the data
        // nên nếu service của bạn trả về một Promise, thì controller cũng phải trả về Promise để đợi kết quả hoàn thành trước khi phản hồi.
        /*
        try {
            return this.songsService.create(createSongDTO);
        }
        catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
        */
       return this.songsService.create(createSongDTO); // create a new song and return it
    }
    // find all
    @Get()
    findAll() : Promise<Song[]> { // return a promise of the array of songs
        /*
        try {
            return this.songsService.findAll();
        }
        catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
            */
        return this.songsService.findAll(); // find all songs in the database
    }
    // find one
    @Get(':id')
    /*async*/ findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) : Promise<Song | null> {
        /*
        const song = await this.songsService.findOne(id); // find the song by id
        if (!song) { // cần kiểm tra !song nên phải dùng async await
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
        return song;
        */
       return this.songsService.findOne(id); // find the song by id
    }
    // update
    @Put(':id') // cần @Param để lấy id từ url
    /*async*/ update(@Param("id", new ParseIntPipe) id : number, @Body() updatedSong: UpdateSongDTO) : Promise<UpdateResult> {
        /*
        const song = await this.songsService.update(id, updatedSong); // find the song by id
        if (!song){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
        return song; // if found, return the song
        */
       return this.songsService.update(id, updatedSong); // find the song by id and update it
    }
    // delete
    @Delete(':id')
    /*async*/ delete(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) : Promise<DeleteResult> {
        /*const song = await this.songsService.delete(id); // find the song by id
        if (!song){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
        return `Success: ${HttpStatus.ACCEPTED}`; // if found, return the song
        */
         return this.songsService.delete(id); // find the song by id and delete it
    }
}
