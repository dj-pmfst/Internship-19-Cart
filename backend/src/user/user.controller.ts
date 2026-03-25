import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @ApiCreatedResponse({ description: 'Korisnik registriran' })
    register(@Body() { email, password }: RegisterDto) {
        return this.userService.register(email, password);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOkResponse({ description: 'Prijava uspješna' })
    login(@Body() { email, password }: LoginDto) {
        return this.userService.login(email, password);
    }
}