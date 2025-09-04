import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Notifications } from './entities/notifications.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PushNotificationController],
  providers: [PushNotificationService],
   imports: [
      TypeOrmModule.forFeature([ User, Client, Notifications, ]), AuthModule
    ],
})
export class PushNotificationModule {}
