import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { UserAddress } from 'src/orders/entities/user-address.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Notifications } from 'src/push-notification/entities/notifications.entity';

@Entity('users')
export class User {
    
    @ApiProperty({
                example: '4356f454545f5f',
                description: 'Id del usuario',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                example: '4356f454545f5f',
                description: 'Email del usuario',
    })
    @Column('text', {
    })
    email: string;

    @ApiProperty({
                example: '255350161',
                description: 'Rut del usuario',
    })
    @Column('text', {
        default: ''
    })
    rut: string;

    @ApiProperty({
                example: '4356f454545f5f',
                description: 'Imagen del usuario',
    })
    @Column('text', {
         default: ''
    })
    image?: string;

    @ApiProperty({
                example: '4356f454545f5f',
                description: 'password del usuario',
    })
    @Column('text', {
    select: false
    })
    password?: string;

    @ApiProperty({
                example: '4356f454545f5f',
                description: 'Nombre Completo del usuario',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
                example: 'true',
                description: 'Usuario Activo',
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
                example: 'true',
                description: 'Verificación del Email',
    })
    @Column('bool', {
        default: false
    })
    emailVerified: boolean;

    @ApiProperty({
                example: '4356f454545f5f',
                description: 'Rol del usuario',
    })
    @Column('text', {
        default: 'user' // user,operator,admin
    })
    role: string;

    @ApiProperty({
                example: 'ExpoToken243434',
                description: 'Token del Telefono',
    })
    @Column('text', {
        default: ''
    })
    tokenPhone: string;

    @ApiProperty({
                example: '2025-10-10',
                description: 'Fecha de creación',
    })
    @Column('date', {
        default: new Date()
    })
    createdAt: Date;

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

    @OneToMany(
        () => UserAddress,
        ( userAddress ) => userAddress.user,
    )
    userAddress: UserAddress;

    @OneToMany(
        () => Order,
        ( order ) => order.user,
    )
    orders: Order;

    @OneToMany(
        () => Notifications,
        ( noti ) => noti.userDestino,
    )
    notificationsCreator: Notifications;

     @OneToMany(
        () => Notifications,
        ( noti ) => noti.userCreator,
    )
    notificationsDestino: Notifications;

    @ManyToOne(
            () => Client,
            ( client ) => client.user,
            { eager: true }
        )
    client: Client
    
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}