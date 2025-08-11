import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderAddress } from './order-address.entity';

@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float', {
    })
    subTotal: number;

    @Column('float', {
    })
    tax: number;

    @Column('float', {
    })
    total: number;

    @Column('int', {
    })
    itemsInOrder: number;

    @Column('bool', {
        default: false
    })
    isPaid: boolean;

    @Column('date', {
        default: null
    })
    paidAt: Date;

    @Column('date', {
        default: new Date()
    })
    createAt: Date;

    @Column('text', {
    })    
    transactionId: string;

    @ManyToOne(
        () => User,
        ( user ) => user.orders,
        { eager: true } // Cargue usuarios con el relacion con la que creo el pedido
    )
    user: User

    @OneToMany(
            () => OrderItem,
            (orderItem) => orderItem.order,
            { cascade: true } // CVada vez que cargue un producto se cargaran las imagenes
        )
    orderItem?: OrderItem[];

    @OneToMany(
            () => OrderAddress,
            (orderAddress) => orderAddress.order,
            { cascade: true, eager: true } // CVada vez que cargue un producto se cargaran las imagenes
        )
    orderAddress: OrderAddress;
}
