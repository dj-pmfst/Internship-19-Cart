import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() { email, password }: RegisterDto) {
    return this.userService.register(email, password);
  }

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.userService.login(email, password);
  }
}