import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { FirebasePushDto } from '@/model/dto/firebase.push.dto';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post()
  async sendPush(@Body() payload: FirebasePushDto) {
    return this.pushService.sendPush(payload);
  }
}
