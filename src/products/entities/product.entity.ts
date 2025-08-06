import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from './product-category.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Entity({ name: 'products' })
export class Product {

     @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('int',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product sizes',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

      // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } // CVada vez que cargue un producto se cargaran las imagenes
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true } // Cargue la relacion con el usuario que creo el 
        // producto com un campo al ser consultado, lo agrega el json
    )
    user: User

    @ManyToOne(
        () => ProductCategory,
        ( productCategory ) => productCategory.product,
        { eager: true } // Cargue la relacion con la que creo el 
        // producto com un campo al ser consultado, lo agrega el json
    )
    productCategory: ProductCategory

    @OneToMany(
        () => OrderItem,
        ( orderItem ) => orderItem.product
    )
    orderItem: OrderItem;
    
    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

}