import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserAddress } from "./user-address.entity";
import { OrderAddress } from "./order-address.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'country' })
export class Country {

    @ApiProperty({
                    example: 'FA',
                    description: 'Id del pais',
        })
    @PrimaryColumn('text')
    id: string;

    @ApiProperty({
                example: 'Venezuela',
                description: 'Nombre del pais',
    })
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
