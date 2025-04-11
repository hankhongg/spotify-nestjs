import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyApiService {
    constructor(private configService : ConfigService, private httpService : HttpService) {}
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
        return this.token; // return the token
    }

}
