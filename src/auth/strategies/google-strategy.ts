import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(private configService: ConfigService, private usersService: UsersService) {
        super({
            clientID: configService.get<string>('OAUTH_GOOGLE_CLIENT_ID') || '',
            clientSecret: configService.get<string>('OAUTH_GOOGLE_CLIENT_SECRET')|| '',
            callbackURL: configService.get<string>('OAUTH_GOOGLE_CALLBACK_URL')|| '',
            scope: ['profile', 'email'],
        })
    }
    
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) {
        console.log("Google profile: ", profile); // log the profile to the console to see how it looks like
        const user = await this.usersService.validateGoogleLogin({
            email: profile.email,
            firstName: profile.given_name || "",
            lastName: profile.family_name || "",
            password: "",
        });
        if (!user) {
            return done(new UnauthorizedException('User not found'), false); // If user is not found, throw an error
        }
        return done(null, user); // Return the user if found
    }

}