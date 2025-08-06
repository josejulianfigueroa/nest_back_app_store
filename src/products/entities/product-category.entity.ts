import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';


@Entity({ name: 'product_category' })
export class ProductCategory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;

    @OneToMany(
            () => Product,
            ( product ) => product.productCategory
    )
    product: Product;

}