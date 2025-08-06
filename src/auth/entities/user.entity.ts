import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { UserAddress } from 'src/orders/entities/user-address.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
         default: ''
    })
    image?: string;

    @Column('text', {
    select: false
    })
    password?: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('bool', {
        default: false
    })
    emailVerified: boolean;

    @Column('text', {
        default: 'user'
    })
    role: string;

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

    @OneToMany(
        () => UserAddress,
        ( userAddress ) => userAddress.user
    )
    userAddress: UserAddress;

    @OneToMany(
        () => Order,
        ( order ) => order.user
    )
    orders: Order[];


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}