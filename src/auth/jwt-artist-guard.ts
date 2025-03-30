import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayLoadType } from "./payload.type";

@Injectable()
export class JwtArtistGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = PayLoadType>(err: any, user: any): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        console.log(user);
        if (user.artistId) {
            return user; // Return the user object if everything is fine
        }
        throw err || new UnauthorizedException('User is not an artist'); // If user is not an artist, throw an error
    }
}