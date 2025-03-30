import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "process";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'), // get the secret from the config service
        })
    }

    async validate(payload: any){
        return {
            userId: payload.sub,
            email: payload.email,
        }
    }

}

// also remember to register this strategy in the auth module
