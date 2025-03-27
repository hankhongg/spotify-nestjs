import { Inject,Controller, Get, Post, Delete, Put, Param, ParseIntPipe, HttpStatus, HttpException, Body } from '@nestjs/common';
import { SongsService } from './songs.service';
import e from 'express';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService,
        @Inject('CONNECTION') private connection: Connection,
    ) {
        console.log(`This is DATABASE: ${connection.DATABASE}`);
    }
    
    // create
    @Post()
    create(@Body() createSongDTO: CreateSongDTO) {
        return this.songsService.create(createSongDTO);
    }
    // find all
    @Get()
    findAll(){
        try {
            return this.songsService.findAll();
        }
        catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND,
                {cause: e},
            );
        }
    }
    // find one
    @Get(':id')
    findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) {
        return this.songsService.findOne(id);
    }
    // update
    @Put(':id')
    update(id, updatedSong) {
        return this.songsService.update(id, updatedSong);
    }
    // delete
    @Delete(':id')
    delete(id) {
        return this.songsService.delete(id);
    }
}
