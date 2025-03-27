import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'src/common/constants/connection';

@Injectable()
export class SongsService {
    // local db
    // local array

    private readonly songs: any[] = [];

    create(createSongDTO) {
        this.songs.push(createSongDTO);
        return createSongDTO;
    }

    findAll() {
        return this.songs;
    }

    findOne(id) {
        return this.songs.find(song => song.id === id);
    }

    update(id, updatedSong) {
        const song = this.findOne(id);
        if (!song) {
            return null;
        }
        const index = this.songs.indexOf(song);
        this.songs[index] = updatedSong;
        return updatedSong;
    }

    delete(id) {
        const song = this.findOne(id);
        if (!song) {
            return null;
        }
        const index = this.songs.indexOf(song);
        this.songs.splice(index, 1);
        return song;
    }
}
