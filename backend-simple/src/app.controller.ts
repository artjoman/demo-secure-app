import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard('basic'))
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  @UseGuards(AuthGuard('basic'))
  getusers(): any {
    return [{firstName: "Artjoms"}];
  }
}
