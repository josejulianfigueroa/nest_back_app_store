import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserAddress } from "./user-address.entity";
import { OrderAddress } from "./order-address.entity";


@Entity({ name: 'country' })
export class Country {

    @PrimaryColumn('text')
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
