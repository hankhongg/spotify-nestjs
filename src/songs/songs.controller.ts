import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, HttpStatus, HttpException } from '@nestjs/common';
import { SongsService } from './songs.service';
import e from 'express';
import { CreateSongDTO } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}
    
    // create
    @Post()
    create(createSongDTO: CreateSongDTO) {
        return this.songsService.create(song);
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
