import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "process";
import { PayLoadType } from "src/auth/dto/payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'), // get the secret from the config service
        })
    }

    async validate(payload: PayLoadType){
        return {
            userId: payload.userId,
            email: payload.email,
            artistId: payload.artistId, // add artistId to the payload
        }
    }

}

// also remember to register this strategy in the auth module
