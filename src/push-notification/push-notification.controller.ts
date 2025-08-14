import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';


@Controller('push-notification')
export class PushNotificationController {
     constructor(private readonly pushNotificationService: PushNotificationService) 
  {}

  // @Get()
  // getHello() {
  //   return this.appService.getHello();
  // }

  @Post('/send-notification')
  sendNotification(@Body() body: { to: string[] }) {
    // const toTokens = [
    // 'ExponentPushToken[L7E31QOmoBpG_8ek_ifilw]',
    // 'ExponentPushToken[Mm8zBHPcveSueR6hsjDTRa]',
    // ];

    this.pushNotificationService.sendNotification(body.to);
  }
}