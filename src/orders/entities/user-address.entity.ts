import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { User } from "src/auth/entities/user.entity";


@Entity({ name: 'user_address' })
export class UserAddress {

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
        ( country ) => country.userAddress,
        { eager: true } // Cargue la relacion con la que creo el 
        // direccion com un campo al ser consultado, lo agrega el json
    )
    country: Country

    @ManyToOne(
        () => User,
        ( user ) => user.userAddress,
        { eager: true } // Cargue la relacion con la que creo el 
        // direccion com un campo al ser consultado, lo agrega el json
    )
    user: User
  
}