import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clients')
export class Client {
    
    @ApiProperty({
                        example: '54254grf',
                        description: 'Id del Cliente',
            })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
                        example: 'nombreEmpresa',
                        description: 'Nombre del Cliente o Empresa',
            })
    @Column('text')
    fullName: string;

    @ApiProperty({
                        example: '25545678-2',
                        description: 'Rut de la empresa',
            })
    @Column('text', {
        unique: true
    })
    rut: string;

    @ApiProperty({
                        example: 'contacto@empresa.com',
                        description: 'Email de la empresa',
            })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
                        example: 'http://cloudinary.com/sdsds',
                        description: 'Imagen de la empresa',
            })
    @Column('text', {
         default: ''
    })
    image: string;

    @ApiProperty({
                        example: '987104600',
                        description: 'Telefono de la empresa',
            })
    @Column('text', {
        default: null
    })
    phone: string;

    @ApiProperty({
                        example: 'true',
                        description: 'Esta activa la empresa',
            })
    @Column('bool', {
        default: true
    })
    isActive: boolean; // true significa que el cliente puede hacer peticiones desde su sitio

    @ApiProperty({
                        example: 'true',
                        description: 'Esta verificado el email',
            })
    @Column('bool', {
        default: false
    })
    emailVerified: boolean;

    @ApiProperty({
                        example: 'Av. Mata',
                        description: 'Dirección de la Empresa',
            })
    @Column('text', {
        default: null
    })
    address: string;

@ApiProperty({
                    example: 'http://www.empresa.com',
                    description: 'Wen de la Empresa',
        })
    @Column('text', {
        default: null
    })
    web: string;

    @ApiProperty({
                        example: 'true',
                        description: 'Esta abierta la empresa, puede recibir peticiones',
            })
    @Column('bool', {
        default: true
    })
    isOpen: boolean;

    @ApiProperty({
                        example: 'restaurant',
                        description: 'Que tipo de empresa es',
            })
    @Column('text', {
        default: 'restaurant' // restaurant ,
    })
    activity: string;

    @ApiProperty({
                        example: '8:00 - 12:00',
                        description: 'en que horario trabaja',
            })
    @Column('text', {
        default: '8:00 AM - 17:00 PM' 
    })
    horario: string;

    @ApiProperty({
                        example: '2025-12-12',
                        description: 'Fecha de Creación',
            })
    @Column('date', {
        default: new Date()
    })
    createdAt: Date;

    @OneToMany(
            () => Product,
            ( product ) => product.client
        )
    product: Product;

     @OneToMany(
            () => Order,
            ( order ) => order.client
        )
    order: Order;

    @OneToMany(
            () => User,
            ( user ) => user.client
        )
    user: User;

     @OneToMany(
            () => ProductCategory,
            ( cat ) => cat.client
        )
    productCategory: ProductCategory;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}