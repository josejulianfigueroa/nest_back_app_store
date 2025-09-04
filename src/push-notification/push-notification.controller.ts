import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Notifications } from './entities/notifications.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { CreateNotificationsRolDto } from './dto/create-notifications-rol.dto';
import { CreateNotificationsUserDto } from './dto/create-notifications-user.dto';

@ApiTags('PushNotifications')
@Controller('push-notification')
export class PushNotificationController {
     constructor(private readonly pushNotificationService: PushNotificationService) 
  {}

    @Post('create/rol')
    @Auth()
    @ApiResponse({ status: 201, description: 'Notification was created', type: Notifications  })
    @ApiResponse({ status: 400, description: 'Bad request' })
        createByRol(
            @Body() createNotificationsRolDto: CreateNotificationsRolDto,
            @GetUser() user: User,
    ) {
      return this.pushNotificationService.createByRol(createNotificationsRolDto, user );
    }

 @Post('create/user')
 @Auth()
 @ApiResponse({ status: 201, description: 'Notification was created', type: Notifications  })
 @ApiResponse({ status: 400, description: 'Bad request' })
    createByUser(
      @Body() createNotificationsUserDto: CreateNotificationsUserDto,
       @GetUser() user: User,
  ) {
      return this.pushNotificationService.createByUser(createNotificationsUserDto, user );
  }

  @Get('get/all')
  @Auth()
  findAll(  @GetUser() user: User, ) {
        return this.pushNotificationService.findAll( user );
    }

  @Delete('delete/:idNotification')
  remove(@Param('idNotification', ParseUUIDPipe ) idNotification: string) {
        return this.pushNotificationService.delete( idNotification );
      }
    
  @Post('/send-notification')
  sendNotification(@Body() body: { to: string[] }) {
    // const toTokens = [
    // 'ExponentPushToken[L7E31QOmoBpG_8ek_ifilw]',
    // 'ExponentPushToken[Mm8zBHPcveSueR6hsjDTRa]',
    // ];

    this.pushNotificationService.sendNotification(body.to);
  }
}