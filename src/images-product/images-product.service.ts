import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateImagesProductDto } from './dto/create-images-product.dto';
import { UpdateImagesProductDto } from './dto/update-images-product.dto';
import { Product } from 'src/products/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImagesProduct } from './entities/images-product.entity';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { User } from 'src/auth/entities/user.entity';
import { validate as isUUID } from 'uuid';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class ImagesProductService {

    private readonly logger = new Logger('ImagesProductService');
  
    constructor(
  
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
  
      @InjectRepository(ImagesProduct)
      private readonly productImageRepository: Repository<ImagesProduct>,
  
      @InjectRepository( ProductCategory )
      private readonly categoryRepository: Repository<ProductCategory>,

      @InjectRepository(Client)
      private readonly clientRepository: Repository<Client>,

      private readonly dataSource: DataSource,
  
    ) {}
    
   async removeImageById(id: string) {
    await this.productImageRepository.delete( id );
    
  }


   async updateImagesByProduct( id: string, updateImagesProductDto: UpdateImagesProductDto, user: User ) {
  
      const { images, idClient, ...rest } = updateImagesProductDto;

        const client = await this.clientRepository.findOne({
      where: { id: idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

  
      const product = await this.productRepository.findOneBy({ 
        id, client});
  
      if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);
  
      // Create query runner
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
  
        if( images) {
          await queryRunner.manager.delete( ImagesProduct, { product: { id } });
  
          product.images = images.map( 
            image => this.productImageRepository.create({ url: image }) 
          )
        }
  
       product.user = user;
        await queryRunner.manager.save( product );
        await queryRunner.commitTransaction();
        await queryRunner.release();
  
        return true;
        
      } catch (error) {
  
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        
        if ( error.code === '23505' )
              throw new BadRequestException(error.detail);
            
            this.logger.error(error)
            // console.log(error)
            throw new InternalServerErrorException('Unexpected error, check server logs');
      }
  
    }
  
    async findOnebyImage( term: string ) {

        return await this.findOne( term );
      }
    
    async findOne( term: string ) {

    let product: Product | null = null;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); 
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .leftJoinAndSelect('prod.productCategory','productCategory')
        .getOne();
    }

    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

}
