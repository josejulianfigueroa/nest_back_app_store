import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductCategory, ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository( ProductCategory )
    private readonly categoryRepository: Repository<ProductCategory>,

    private readonly dataSource: DataSource,

  ) {}



  async create(createProductDto: CreateProductDto, user: User) {

    let category: ProductCategory | null = null;
    category = await this.categoryRepository.findOneBy({ id: createProductDto.idProductCategory });

    if ( !category ) {
      throw new BadRequestException(`Category with id ${ createProductDto.idProductCategory } not found`);
    }

    try {
      const { images = [] } = createProductDto;

      const product = this.productRepository.create({
        tags: createProductDto.tags || [],
        gender: createProductDto.gender,
        sizes: createProductDto.sizes,
        stock: createProductDto.stock || 0,
        slug: createProductDto.slug?.toLowerCase() ?? '',
        description: createProductDto.description || '',
        price: createProductDto.price || 0,
        title: createProductDto.title,
        images: images.map( image => this.productImageRepository.create({ url: image }) ),
        user,
        productCategory: category
      });
      
      await this.productRepository.save( product );

      return { ...product, images };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }


  async findAll( paginationDto: PaginationDto ) {

    let { page = 1, take = 12, gender} = paginationDto;

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
     if (gender === '') {gender = undefined;}

    const products = await this.productRepository.find({
      take: take,
      skip: (page - 1) * take,
      relations: {
        images: true,
      },
       where: {
        gender: gender,
     }
    })

     // 2. Obtener el total de páginas
    // todo:
    const totalCount = await this.productRepository.count({
      where: {
        gender: gender,
      },
    });
    
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map( ( product ) => ({
      ...product,
      images: (product.images ?? []).map( img => img.url )
    }))
    }

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
        .leftJoinAndSelect('prod.images','prodImages')// prodImages es un alias para las imagenes
        .getOne();
    }

    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

   async findOnePlain( term: string ) {
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const { images, ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({ id, ...toUpdate });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } });

        product.images = images.map( 
          image => this.productImageRepository.create({ url: image }) 
        )
      }
      
      // await this.productRepository.save( product );
      product.user = user;
      
      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
    
  }


  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

    async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

}
