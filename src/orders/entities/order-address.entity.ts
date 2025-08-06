import { Country } from "./country.entity";
import { Order } from "./order.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_address' })
export class OrderAddress {
   
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
    })
    firstName: string;

    @Column('text', {
    })
    lastName: string;

    @Column('text', {
    })
    address: string;

    @Column('text', {
    })
    address2: string;

    @Column('text', {
    })
    phone: string;

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


