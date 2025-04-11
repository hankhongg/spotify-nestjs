import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpotifyApiService } from './spotify-api/spotify-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Module({
    imports: [ConfigModule,
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                baseURL: configService.get('SPOTIFY_CLIENT_BASE_URL'),
                headers: {
                    "Content-Type": "application/json",
                    // leave authorization cuz token gonna expired so no need to set it here
                }
            })
        }),
        TypeOrmModule.forFeature([Song, Artist]),
    ],
    providers: [SpotifyApiService],
    exports: [SpotifyApiService], // export the service so it can be used in other modules
})
export class ExternalApisModule {}
