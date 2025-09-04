import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { ImagesProduct } from 'src/images-product/entities/images-product.entity';

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
    })
    @Column('text', {
    })
    title: string;

    @ApiProperty({
        example: 5000,
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
    })
    @Column('text', {
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
        example: 'XL',
        description: 'Product size',
    })
    @Column('text',{
    })
    size: string;

     @ApiProperty({
        example: '5',
        description: 'calificacion del producto',
    })
    @Column('float', {
        default: 5
    })
    stars: number;

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

     @ApiProperty({
        example: ['megaproduct', 'tendencia'],
        description: 'tags para referenciar el producto',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: '2025-10-10',
        description: 'Fecha de Creacion del Producto',
    })
    @Column('date', {
        default: new Date()
    })
    createdAt: Date;

     @ApiProperty({
        example: '2retiro_en_tienda',
        description: 'Tipo de entrega del producto',
    })
    @Column('text', {
        array: true,
        default: ['retiro_en_local'] // delivery, consumo_local
    })
    opciones_entrega: string[];

  
    @ApiProperty()
    @OneToMany(
        () => ImagesProduct,
        (productImage) => productImage.product,
        { cascade: true, eager: true } 
    )
    images?: ImagesProduct[];


    @ManyToOne(
        () => User,
        ( user ) => user.product,
    )
    user?: User

    @ManyToOne(
        () => Client,
        ( client ) => client.product,
        {eager: true}
    )
    client?: Client

    @ManyToOne(
        () => ProductCategory,
        ( productCategory ) => productCategory.product,
        { eager: true }
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