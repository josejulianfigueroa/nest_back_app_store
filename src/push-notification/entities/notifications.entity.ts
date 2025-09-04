
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';


@Entity({ name: 'notifications' })
export class Notifications {

    @ApiProperty({
                           example: 'fgfg45454545',
                           description: 'Id de la notificacion',
           })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                       example: 'hola que tal',
                       description: 'Mensaje de la notificacion',
       })
    @Column('text', {
    })
    mensaje: string;

    
   @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @ManyToOne(
                () => User,
                ( user ) => user.notificationsDestino,
            )
    userDestino: User
   
     @ManyToOne(
                () => User,
                ( user ) => user.notificationsCreator,
                 {eager: true}
            )
    userCreator: User
}
