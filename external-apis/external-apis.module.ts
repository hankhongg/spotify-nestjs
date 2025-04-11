import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpotifyApiService } from './spotify-api/spotify-api.service';

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
    ],
    providers: [SpotifyApiService],
})
export class ExternalApisModule {}
