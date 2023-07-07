import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './message.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return { message: this.appService.getHello() };
  }

  @Post('greeting')
  createGreeting(@Body() value: Message): string {
    this.appService.sendMessage(value);
    return value.text;
  }
}
