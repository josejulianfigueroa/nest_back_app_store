import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'order_item' })
export class OrderItem {

    @ApiProperty({
                           example: 'fgfg45454545',
                           description: 'Id del item de la orden',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                       example: 'fgfg45454545',
                       description: 'Cantidad del item en la orden',
    })
    @Column('int')
    quantity: number;

    @ApiProperty({
                       example: '5000',
                       description: 'Precio del item',
    })
    @Column('int',{
        default: 0
    })
    price: number;

    @ApiProperty({
                       example: 'M',
                       description: 'Size del producto',
    })
    @Column('text',{
        default: 0
    })
    size: string;

    @ManyToOne(
        () => Order,
        ( order ) => order.orderItem,
        { eager: true }
    )
    order: Order

    @ManyToOne(
        () => Product,
        ( product ) => product.orderItem,
         { eager: true}
    )
    product: Product

}