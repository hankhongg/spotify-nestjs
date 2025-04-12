import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer"; // use bearer not jwt
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'bearer'){
    constructor(private readonly authService: AuthService){
        super();
    }
    async validate(apiKey: string) {
        const user = await this.authService.validateApiKey(apiKey);
        if (!user) throw new UnauthorizedException('Invalid API key'); // If API key is invalid, throw an error
        return user; // Return the user if API key is valid
    }

}