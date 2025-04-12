import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayLoadType } from "../dto/payload.type";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService :  ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('REFRESH_JWT_SECRET'), // get the secret from the config service
        });
    }

    async validate(payload: PayLoadType) {
        return {
            userId: payload.userId,
            email: payload.email,
            artistId: payload.artistId, // add artistId to the payload
        }
    }
}