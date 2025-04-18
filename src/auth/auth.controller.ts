import { Body, Controller, Get, HttpException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { create } from 'domain';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth-guard/jwt-auth-guard';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshGuard } from './guards/refresh-guard/refresh-guard';
import { GoogleGuard } from './guards/google-guard/google-guard';
import { PayLoadType } from './dto/payload.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {} // inject the users service

    @ApiOperation({ summary: 'Sign up a new user' }) // operation aka guiding
    @ApiResponse({ status: 201, description: 'User created successfully'}) // response for the operation
    @Post('signup')
    signup(@Body() createUserDTO: CreateUserDto) : Promise<User>{
        return this.usersService.create(createUserDTO); // create a new user and return it
    }
    
    @ApiOperation({ summary: 'Login a user' }) // operation aka guiding
    @ApiResponse({ status: 200, description: 'User logged in successfully'}) // response for the operation
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = this.authService.login(loginDto); // login the user and return the user
        if(!user) return new UnauthorizedException('User not found'); // if user not found, throw an error
        return user; // return the user
    }
    
    @Get('enable2fa')
    @ApiBearerAuth('JWT-auth') // use the JWT auth scheme
    @UseGuards(JwtAuthGuard)
    enable2FA(@Req() req: any) {
        return this.authService.enable2FA(req.user.userId); // enable 2FA for the user and return the secret
    }
    
    @Get('disable2fa')
    @ApiBearerAuth('JWT-auth') // use the JWT auth scheme
    @UseGuards(JwtAuthGuard)
    disable2FA(@Req() req: any){
       return this.authService.disable2FA(req.user.userId); // disable 2FA for the user and return the secret 
    }
    
    @Post('validate2fa')
    @ApiBearerAuth('JWT-auth') // use the JWT auth scheme
    @UseGuards(JwtAuthGuard)
    validate2fa(@Req() req: any, @Body() validateTokenDto: ValidateTokenDto) : Promise<{verified: boolean}>{
        return this.authService.validate2fa(req.user.userId, validateTokenDto); // validate the 2FA token and return the result
    }
    
    @Get('profile-api-key')
    @ApiBearerAuth('JWT-auth') // use the JWT auth scheme
    @UseGuards(AuthGuard('bearer')) // use the api key strategy to protect this route
    getProfile(@Req() req: any) {
        req.user.password = ""; // remove the password from the user object
        return {
            msg: "Authenticated with API key",
            user: req.user, // return the user object
        }
    }

    @Get('refresh')
    @UseGuards(RefreshGuard) 
    refreshToken(@Req() req : any){
        return this.authService.refreshToken(req.user); // refresh the token and return the new token
    }

    @UseGuards(GoogleGuard)
    @Get('google/login')
    googleLogin(){ }

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    async googleCallback(@Req() req: any, @Res() res : any){
        const user = req.user;
        const payload : PayLoadType = {
            email:  user.email,
            userId: user.id,
            artistId: user.artistId,
        }
        const accessToken = await this.authService.signAccessToken(payload); // sign the access token
        const refreshToken = await this.authService.signRefreshToken(payload); // sign the refresh token

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // make the cookie http only
            secure: true, // make the cookie secure
            sameSite: 'strict', // make the cookie same site
            maxAge: 1 * 24 * 60 * 60 * 1000, // set the cookie to expire in 1 days
        });

        res.redirect('http://localhost:3000/auth/google/redirect?accessToken=' + accessToken); // redirect to the frontend with the access token
    }
}
