import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

@Injectable()
export class SongsService {
    // local db
    // local array

    // inject the repository here
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>;
    // inject the connection here

    private readonly songs: any[] = [];

    // create(createSongDTO) {
    //     this.songs.push(createSongDTO);
    //     return createSongDTO;
    // }

    async create(songDTO : CreateSongDTO) : Promise<Song> { // dùng async để gọi hàm bất đồng bộ trả await nhưng vẫn là promise
        const song = new Song(); // create a new song object
        song.title = songDTO.title;
        song.artists = songDTO.artists;
        song.album = songDTO.album;
        song.releasedDate = songDTO.releasedDate;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        // save the song to the database
        return await this.songRepository.save(song); // save the song to the database
        // return this.songs.push(songDTO); // save the song to the array
    }

    async findAll() : Promise<Song[]> { // return a promise of the array of songs
        // return this.songs; // return the array of songs
        return await this.songRepository.find(); // find all songs in the database
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
        /*
        const song = await this.findOne(id); // find the song by id
        if (!song) { // check if the song exists
            return null;
        }
        return await this.songRepository.save({...song, ...updateDTOSong}); // merge the song with the update data and save it to the database
        */
        // update the song with the new data
        return await this.songRepository.update(id, updateDTOSong); // update the song and return it
        
    }

    async delete(id: number): Promise<DeleteResult> { // return a promise of the delete result
        /*
        const song = await this.findOne(id); // nhớ thêm await
        if (!song) {
            return null;
        }
        return await this.songRepository.delete(id); // delete the song from the database
        */
       return await this.songRepository.delete(id); // delete the song from the database
    }
}
