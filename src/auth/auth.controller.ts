import { Body, Controller, Get, HttpException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { create } from 'domain';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = this.authService.login(loginDto); // login the user and return the user
        if(!user) return new UnauthorizedException('User not found'); // if user not found, throw an error
        return user; // return the user
    }
    
    @Get('enable2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(@Req() req: any) {
        return this.authService.enable2FA(req.user.userId); // enable 2FA for the user and return the secret
    }
    
    @Get('disable2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(@Req() req: any){
       return this.authService.disable2FA(req.user.userId); // disable 2FA for the user and return the secret 
    }
    
    @Post('validate2fa')
    @UseGuards(JwtAuthGuard)
    validate2fa(@Req() req: any, @Body() validateTokenDto: ValidateTokenDto) : Promise<{verified: boolean}>{
        return this.authService.validate2fa(req.user.userId, validateTokenDto); // validate the 2FA token and return the result
    }
    
    @Get('profile')
    @ApiBearerAuth('JWT-auth') // use the JWT auth scheme
    @UseGuards(AuthGuard('bearer')) // use the api key strategy to protect this route
    getProfile(@Req() req: any) {
        req.user.password = ""; // remove the password from the user object
        return {
            msg: "Authenticated with API key",
            user: req.user, // return the user object
        }
    }
}
