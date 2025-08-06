import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities';

@Entity({ name: 'order_item' })
export class OrderItem {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @Column('int',{
        default: 0
    })
    price: number;

    @Column('text',{
        default: 0
    })
    size: string;

    @ManyToOne(
        () => Order,
        ( order ) => order.orderItem,
        { eager: true } // Cargue la relacion con la que creo el
    )
    order: Order

    @ManyToOne(
        () => Product,
        ( product ) => product.orderItem,
         { eager: true}
    )
    product: Product

}