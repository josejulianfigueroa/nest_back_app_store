
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';
import { Client } from 'src/clients/entities/client.entity';


@Entity({ name: 'product_category' })
export class ProductCategory {

    @ApiProperty({
                           example: 'fgfg45454545',
                           description: 'Id de la categoria',
           })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                       example: 'Tecnología',
                       description: 'Nombre de la Categoria',
       })
    @Column('text', {
    })
    name: string;

     @ApiProperty({
                       example: 'http://image',
                       description: 'Imagen de la Categoria',
       })
    @Column('text', {
    })
    image: string;

    @OneToMany(
            () => Product,
            ( product ) => product.productCategory
    )
    product: Product;

    @ManyToOne(
                () => Client,
                ( client ) => client.productCategory,
            )
    client: Client

}
