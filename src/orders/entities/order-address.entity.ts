import { ApiProperty } from "@nestjs/swagger";
import { Country } from "./country.entity";
import { Order } from "./order.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_address' })
export class OrderAddress {
   
    @ApiProperty({
                    example: 'fgfg45454545',
                    description: 'Id de la direcci{on de la orden',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                    example: 'juan',
                    description: 'Primer nombre de la dirección',
    })
    @Column('text', {
    })
    firstName: string;

    @ApiProperty({
                    example: 'Perez',
                    description: 'Apellido de la Dirección',
    })
    @Column('text', {
    })
    lastName: string;

    @ApiProperty({
                    example: 'fgfg45454545',
                    description: 'Dirección',
    })
    @Column('text', {
    })
    address: string;

    @ApiProperty({
                    example: 'fgfg45454545',
                    description: 'Dirección Adicional',
    })
    @Column('text', {
    })
    address2: string;

    @ApiProperty({
                    example: 'fgfg45454545',
                    description: 'Telefono de la dirección',
    })
    @Column('text', {
    })
    phone: string;

    @ApiProperty({
                    example: 'fgfg45454545',
                    description: 'Ciudad de la Direccion',
    })
    @Column('text', {
    })
    city: string;

   @ManyToOne(
        () => Country,
        ( country ) => country.orderAddress,
        { eager: true } // Cargue la relacion con la que creo el 
        // direccion com un campo al ser consultado, lo agrega el json
    )
    country: Country

    @ManyToOne(
        () => Order,
        ( order ) => order.orderAddress
    )
    order: Order
  
}


