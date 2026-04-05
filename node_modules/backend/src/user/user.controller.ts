import { 
    Body, 
    Controller, 
    Post, 
    HttpCode, 
    HttpStatus,
    Put,
    Get,
    UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/user/current-user.decorator';
import { UserAuthGuard } from './user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(UserAuthGuard)
    @Get('me')
    @ApiOkResponse({ description: 'Profil prijavljenog korisnika' })
    getMe(@CurrentUser('id') userId: number) {
        return this.userService.getMe(userId);
    }

    @UseGuards(UserAuthGuard)
    @Put('me')
    @ApiOkResponse({ description: 'Azuriran profil' })
    updateMe(@CurrentUser('id') userId: number, @Body() dto: UpdateUserDto) {
        return this.userService.updateMe(userId, dto);
    }
}