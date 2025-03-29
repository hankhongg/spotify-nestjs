import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/entities/artist.entity';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';

@Injectable()
export class SongsService {
    // local db
    // local array

    // inject the repository here
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>;
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>; // inject the artist repository


    async create(songDTO : CreateSongDTO) : Promise<Song> { // dùng async để gọi hàm bất đồng bộ trả await nhưng vẫn là promise
        const song = new Song(); // create a new song object
        song.title = songDTO.title;
        song.album = songDTO.album;
        song.releasedDate = songDTO.releasedDate;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;    
        // save the song to the database
        const artists = await this.artistRepository.findByIds(songDTO.artists); // create the artists from the DTO
        song.artists = artists; // set the artists to the song
        return await this.songRepository.save(song); // save the song to the database
    }

    async findAll() : Promise<Song[]> { // return a promise of the array of songs
        const songs = await this.songRepository.find({relations: ['artists']}); // find all songs in the database
        return songs; // return the songs
    }

    async findOne(id: number) : Promise<Song | null> { // return a promise of the song
        const song = await this.songRepository.findOne({where: {id}}); // find the song by id
        if (!song){
            return null; // if not found, return null
        }    
        else {
            return song; // if found, return the song
        }
    }

    async update(id: number, updateDTOSong: UpdateSongDTO) : Promise<UpdateResult> { // return a promise of the update result
        // update the song with the new data
        return await this.songRepository.update(id, updateDTOSong); // update the song and return it
        
    }

    async delete(id: number): Promise<DeleteResult> { // return a promise of the delete result
       return await this.songRepository.delete(id); // delete the song from the database
    }

    paginate(options: IPaginationOptions) : Promise<Pagination<Song>>{

        // thêm query builder để tìm kiếm theo tên bài hát / thời gian
        const queryBuilder = this.songRepository.createQueryBuilder('songQuery'); // create a query builder for the song entity
        // thêm điều kiện tìm kiếm theo tên bài hát
        queryBuilder.orderBy('songQuery.releasedDate', 'DESC'); // order by release date descending
        return paginate<Song>(queryBuilder, options); // paginate the songs
    }
}
