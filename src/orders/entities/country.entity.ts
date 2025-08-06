import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAddress } from "./user-address.entity";
import { OrderAddress } from "./order-address.entity";


@Entity({ name: 'country' })
export class Country {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;
    
    @OneToMany(
            () => UserAddress,
            ( userAddress ) => userAddress.country
        )
    userAddress: UserAddress

    @OneToMany(
            () => OrderAddress,
            ( orderAddress ) => orderAddress.country
        )
    orderAddress: OrderAddress
}
