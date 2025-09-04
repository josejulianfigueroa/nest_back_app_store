import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { Notifications } from './entities/notifications.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateNotificationsRolDto } from './dto/create-notifications-rol.dto';
import { CreateNotificationsUserDto } from './dto/create-notifications-user.dto';

@Injectable()
export class PushNotificationService {


  private expo = new Expo({
    // accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
  });
  private readonly logger = new Logger('PushNotificationService');

  constructor(

    @InjectRepository(Notifications)
    private readonly notiRepository: Repository<Notifications>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}

  async createByRol( createNotificationsRolDto: CreateNotificationsRolDto, user: User) {
  
    createNotificationsRolDto.roles.forEach( async rol => {

     let usersToSend = await this.userRepository.find({
       where: { role: rol, client: user.client }
     });
    
     usersToSend = usersToSend.filter( u => u.id !== user.id);

    usersToSend.forEach( userSend => {
  
        const notification = this.notiRepository.create({
           mensaje: createNotificationsRolDto.mensaje,
           userDestino : userSend,
           userCreator: user
         });
   
       this.notiRepository.save( notification );
      });
   
    });
    return true;
    }


  async createByUser( createNotificationsUserDto: CreateNotificationsUserDto, user: User) {

     const userToSend = await this.userRepository.findOne({
       where: { id: createNotificationsUserDto.idUserToSend, client: user.client }
     });

     if (!userToSend) {
       throw new BadRequestException(`User not found`);
     }

        const notification = this.notiRepository.create({
           mensaje: createNotificationsUserDto.mensaje,
           userDestino : userToSend,
           userCreator: user
         });
   
       this.notiRepository.save( notification );
   
    return true;
    }

  async findAll( user: User) {

     return await this.notiRepository.find({
       where: { userDestino: user }
     });

    }

 async delete( idNotificacion: string) {

      const noti =  await this.notiRepository.findOne({
       where: { id: idNotificacion }
     });
     if(noti){
      await this.notiRepository.remove( noti );
        return true;
     }
     else {
       throw new BadRequestException(`Notificacion not found`);
     }
       

    }

  sendNotification(toTokens: string[]) {
    const areExpoTokens = toTokens.every(Expo.isExpoPushToken);

    if (!areExpoTokens) {
      throw new BadRequestException('Invalid expo push tokens');
    }

    const messages: ExpoPushMessage[] = toTokens.map((token) => ({
      to: token,
      sound: 'default',
      body: 'This is a test notification form my backend',
      title: 'Hola título',
      data: { chatId: 'XYZ-456' },
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: Promise<ExpoPushTicket[]>[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(ticketChunk);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Error sending push notification chunks',
        );
      }
    }

    return {
      done: true,
    };
  }
}
