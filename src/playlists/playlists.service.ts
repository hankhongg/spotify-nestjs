import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PlaylistsService {
  @InjectRepository(Playlist)
  private readonly playlistRepository: Repository<Playlist>;
  @InjectRepository(Song)
  private readonly songRepository: Repository<Song>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>; // inject the user repository

  async create(createPlaylistDto: CreatePlaylistDto) : Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = createPlaylistDto.name;
    const user = await this.userRepository.findOne({where: {id: createPlaylistDto.user}})
    if (!user) throw new NotFoundException(`User with id ${createPlaylistDto.user} not found`);
    playlist.user = user;
    const songs = await this.songRepository.findByIds(createPlaylistDto.songs); // create the songs from the DTO
    if (!songs) throw new NotFoundException(`Songs with ids ${createPlaylistDto.songs} not found`);
    playlist.songs = songs; // set the songs to the playlist
    return await this.playlistRepository.save(playlist); // save the playlist to the database
  }

  findAll() {
    return this.playlistRepository.find({relations: ['songs', 'user']}); // find all playlists in the database
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
