import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';


@Entity({ name: 'product_images' })
export class ImagesProduct {

    @ApiProperty({
                    example: '4356f454545f5f',
                    description: 'Id de la imagen del producto',
    })
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ApiProperty({
                    example: 'http://cloudinary.com/sdsds',
                    description: 'Link imagen del usuario',
    })
    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        {  onDelete: 'CASCADE' }
    )
    product: Product

}
