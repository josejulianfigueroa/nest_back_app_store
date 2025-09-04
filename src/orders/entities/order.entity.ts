import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderAddress } from './order-address.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'orders' })
export class Order {

    @ApiProperty({
            example: '4356f454545f5f',
            description: 'Id de la orden',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
            example: '50000',
            description: 'sub total de la orden',
    })
    @Column('float', {
    })
    subTotal: number;

     @ApiProperty({
            example: '19',
            description: 'Tasa de la orden',
    })
    @Column('float', {
    })
    tax: number;

     @ApiProperty({
            example: '100000',
            description: 'Total de la orden',
    })
    @Column('float', {
    })
    total: number;

    @ApiProperty({
            example: '10',
            description: 'Cantidad de items en la orden',
    })
    @Column('int', {
    })
    itemsInOrder: number;

     @ApiProperty({
            example: 'true',
            description: 'Esta pagada',
    })
    @Column('bool', {
        default: false
    })
    isPaid: boolean;

    @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de pago',
    })
    @Column('timestamp', {
        default: null
    })
    paidAt: Date;

     @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de Creación de la orden',
    })
   @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        })
    createdAt: Date;

  
    @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de Cierre de la orden',
    })
    @Column('timestamp', {
        default: null
    })
    fechaTermino: Date;

    @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de Preparaciónn de la orden',
    })
    @Column('timestamp', {
        default: null
    })
    fechaPreparacion: Date;

   @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de Entrega de la orden',
    })
    @Column('timestamp', {
        default: null
    })
    fechaEntrega: Date;

      @ApiProperty({
            example: '2025-12-12',
            description: 'Fecha de Preparaciónn de la orden',
    })
    @Column('timestamp', {
        default: null
    })
    fechaCancelacion: Date;

    @ApiProperty({
            example: '3444',
            description: 'Id de transaccion de la orden',
    })
    @Column('text', {
    })    
    transactionId: string;

     @ApiProperty({
            example: 'web',
            description: 'web o mobile',
    })
    @Column('text', {
    })    
    canal: string; // mobile, web

    @ApiProperty({
            example: '4356f454545f5f',
            description: 'Status de de la orden',
    })
    @Column('text', { default: 'nueva' }) // cancelada, preparacion, entregada, terminada
     status: string;

    @ManyToOne(
        () => User,
        ( user ) => user.orders,
        { eager: true } // Cargue campo user al json con la relacion
    )
    user: User

    @OneToMany(
            () => OrderItem,
            (orderItem) => orderItem.order,
            { cascade: true }
                )
    orderItem?: OrderItem[];

    @OneToMany(
            () => OrderAddress,
            (orderAddress) => orderAddress.order,
            { cascade: true, eager: true }
        )
    orderAddress: OrderAddress;

     @ManyToOne(
            () => Client,
            ( client ) => client.order,
            { eager: true }
        )
    client: Client
}
