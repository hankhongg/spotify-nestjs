import { Inject,Controller, Get, Post, Delete, Put, Param, ParseIntPipe, HttpStatus, HttpException, Body, Query, DefaultValuePipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import e from 'express';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

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
       return this.songsService.create(createSongDTO); // create a new song and return it
    }

    // find all
    /* PAGINATION
    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1, // default page is 1
        @Query('limit', new DefaultValuePipe(10) ,new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) limit: number = 10, // default limit is 10
    ) : Promise<Pagination<Song>> { // return a promise of the pagination of songs
        limit = limit > 100 ? 100 : limit; // limit the number of songs to 100
        
        return this.songsService.paginate({page, limit}); // find all songs in the database and paginate them
    }
    */

    @Get()
    findAll() : Promise<Song[]> {
        return this.songsService.findAll(); // find all songs in the database and return them
    }

    //✅ DefaultValuePipe(10) handles NestJS query params properly.
    //✅ = 10 ensures TypeScript doesn't complain about missing values in non-NestJS contexts.

    // find one
    @Get(':id')
    findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) : Promise<Song | null> {
       return this.songsService.findOne(id); // find the song by id
    }

    // update
    @Put(':id') // cần @Param để lấy id từ url
    update(@Param("id", new ParseIntPipe) id : number, @Body() updatedSong: UpdateSongDTO) : Promise<UpdateResult> {

       return this.songsService.update(id, updatedSong); // find the song by id and update it
    }
    
    // delete
    @Delete(':id')
    delete(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) : Promise<DeleteResult> {
         return this.songsService.delete(id); // find the song by id and delete it
    }
    

}
