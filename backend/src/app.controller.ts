import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth/auth.service';
import { User } from './user/user.entity';
import { UsersService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userService: UsersService,
    private authService: AuthService,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() loginData) {
    return this.authService.login(loginData);
  }

  @Post('register')
  register(@Body() loginData) {
    return this.authService.register(loginData);
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
