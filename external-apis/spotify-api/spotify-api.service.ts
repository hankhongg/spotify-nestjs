import { ar } from '@faker-js/faker/.';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/artists/entities/artist.entity';
import { Song } from 'src/songs/song.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpotifyApiService {
    constructor(private configService : ConfigService, private httpService : HttpService) {}
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>; // inject the song repository
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>; // inject the artist repository

    private token : string | null = null
    private expireTime = 0;

    async getToken() : Promise<string> {
        if (this.token && this.expireTime - (Date.now() / 1000) > 0){
            return this.token; // return the token if it is not expired
        }
        const clientId = this.configService.get<string>("SPOTIFY_CLIENT_ID");
        const clientSecret = this.configService.get<string>("SPOTIFY_CLIENT_SECRET");
        const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await firstValueFrom(
            this.httpService.post(
                'https://accounts.spotify.com/api/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // this is the correct content type for form data for spotify
                        'Authorization': `Basic ${encoded}`
                    }
                }
            )
        )
        this.token = response.data.access_token; // set the token
        this.expireTime = response.data.expires_in + (Date.now() / 1000); // set the expire time
        if (!this.token) {
            throw new Error("Failed to get token"); // throw error if token is not present
        }
        console.log("Token: ", this.token); // log the token to the console
        return this.token; // return the token
    }

    async searchSongs(query: string) : Promise<Song[]> {
        const token = await this.getToken(); // get the token
        const baseUrl = this.configService.get<string>("SPOTIFY_CLIENT_BASE_URL");
        const response = await firstValueFrom(
            this.httpService.get(
                `${baseUrl}/search`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // set the token in the header
                    },
                    params: {
                        q: query,
                        type: 'track',
                        limit: 10 // limit the number of results to 10
                    }
                }
            )
        )
        const currentSongsCount = await this.songRepository.count(); // get the current number of songs in the database
        const currentArtistsCount = await this.artistRepository.count();
        return Promise.all(response.data.tracks.items.map( // promise.all to wait for all the promises to resolve in parallel
            async track => {
              const artists = await Promise.all(track.artists.map(async artist => {
                const newArtist = this.artistRepository.create({
                  artistName: artist.name,
                });
                await this.artistRepository.save(newArtist);
                return {
                  id: currentArtistsCount + 1,
                  artistName: artist.name
                };
              }));
          
              return this.songRepository.create({
                id: currentSongsCount + 1,
                title: track.name,
                artists,
                album: track.album.name,
              });
            }
          ));
          
    }

}

// @PrimaryGeneratedColumn() // auto increment id so it is not required to be passed in the request body
//     id: number;
//     @Column()
//     title: string;
//     // @Column('varchar', {array: true})
//     // artists: string[];
//     @Column()
//     album: string;
//     @Column('date')
//     releasedDate: string;
//     @Column('time')
//     duration: string;
//     @Column('text', {nullable: true})
//     // @Optional() //@Optional() là decorator của NestJS, nhưng bạn đang dùng trong Entity của TypeORM, điều này không hợp lệ. 
//     lyrics?: string;

//     @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true}) // many to many relationship with artist entity
//     @JoinTable({name: "songs_artists"}) // this will create a join table to store the relationship
//     artists: Artist[]; // this is the foreign key to the artist table

//     @ManyToOne(() => Playlist, (playlist) => playlist.songs) // many to one relationship with playlist entity
//     @JoinColumn()
//     playlist: Playlist; // this is the foreign key to the playlist table