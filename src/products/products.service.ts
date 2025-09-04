import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { User } from 'src/auth/entities/user.entity';
import { PaginationOffsetDto } from 'src/common/dto/pagination-offset.dto';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { ImagesProduct } from 'src/images-product/entities/images-product.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

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


  async create(createProductDto: CreateProductDto, user: User) {

      const client = await this.clientRepository.findOne({
      where: { id: createProductDto.idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

    let category: ProductCategory | null = null;
    category = await this.categoryRepository.findOneBy({ id: createProductDto.idProductCategory,
             client                                             
     });

    if ( !category ) {
      throw new BadRequestException(`Category with id ${ createProductDto.idProductCategory } not found`);
    }

      const productExist = await this.productRepository.findOne({
      where: { client, productCategory: category, title: createProductDto.title   }
    });

    if(productExist){
         throw new BadRequestException( "El producto ya existe en el cliente, categoria y titulo ingresado" );
    }

    try {
      const { images = [] } = createProductDto;

      let product = this.productRepository.create({
        tags: createProductDto.tags || [],
        gender: createProductDto.gender,
        size: createProductDto.size,
        stock: createProductDto.stock || 0,
        slug: createProductDto.slug?.toLowerCase() ?? '',
        description: createProductDto.description || '',
        price: createProductDto.price || 0,
        title: createProductDto.title,
        images: images.map( image => this.productImageRepository.create({ url: image }) ),
        user,
        productCategory: category,
        client,
        stars: createProductDto.stars | 5,
        opciones_entrega: createProductDto.opciones_entrega
      });
      
      await this.productRepository.save( product );
      delete product.client;
      delete product.user;
      return { ...product, images };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async findAllWithOffsetMobile( paginationDto: PaginationOffsetDto, idClient: string ) {

      const client = await this.clientRepository.findOne({
      where: { id: idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

    const { limit = 10, offset = 0, idProductCategory } = paginationDto;

      let categoryAux: ProductCategory | null | undefined = null;

    if (idProductCategory === '' || idProductCategory === undefined ) {categoryAux = undefined;}

    else {

    categoryAux = await this.categoryRepository.findOneBy({ id: paginationDto.idProductCategory,
             client                                             
     });

    if ( !categoryAux ) {
      throw new BadRequestException(`Category with id ${ idProductCategory } not found`);
    }
}

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
      where: {
        client,
         productCategory: categoryAux
     }
    })

   return products.map( ( product ) => ({
      ...product,
      images: (product.images ?? []).map( img => img.url )
    }))

  }

  async findAll( paginationDto: PaginationDto, idClient:string ) {

     const client = await this.clientRepository.findOne({
      where: { id: idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

    let { page = 1, take = 12, gender, idProductCategory} = paginationDto;

    let categoryAux: ProductCategory | null | undefined = null;

    if (idProductCategory === '' || idProductCategory === undefined ) {categoryAux = undefined;}

    else {

    categoryAux = await this.categoryRepository.findOneBy({ id: paginationDto.idProductCategory,
             client                                             
     });

    if ( !categoryAux ) {
      throw new BadRequestException(`Category with id ${ idProductCategory } not found`);
    }
}
    
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
     if (gender === '' || gender === undefined) {gender = undefined;}

    const products = await this.productRepository.find({
      take: take,
      skip: (page - 1) * take,
      relations: {
        images: true,
      },
       where: {
        gender: gender,
        client,
        productCategory: categoryAux
     }
    })

     // Obtener el total de páginas
    const totalCount = await this.productRepository.count({
      where: {
        gender: gender,
        client,
        productCategory: categoryAux
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

  async findOne( term: string, idClient: string) {

    const client = await this.clientRepository.findOne({
      where: { id: idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

    let product: Product | null = null;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term, client });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); 
      product = await queryBuilder
        .where('(UPPER(title) =:title or slug =:slug)', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .andWhere('prod.clientId = :idClient', { idClient })
        .leftJoinAndSelect('prod.images','prodImages')
        .leftJoinAndSelect('prod.productCategory','productCategory')// prodImages es un alias para las imagenes
        .leftJoinAndSelect('prod.client','client')
        .getOne();
    }

    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

   async findOnePlain( term: string, idClient: string ) {
    const { images = [], ...rest } = await this.findOne( term, idClient );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const client = await this.clientRepository.findOne({
      where: { id: updateProductDto.idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

    let category: ProductCategory | null = null;

    if(updateProductDto.idProductCategory){
  
    category = await this.categoryRepository.findOneBy({ id: updateProductDto.idProductCategory, client });

    if ( !category ) {
      throw new BadRequestException(`Category with id ${ updateProductDto.idProductCategory } not found`);
    }

    }

    const { images, idProductCategory, idClient, ...toUpdate } = updateProductDto;
   
    const product = await this.productRepository.preload({ id, ...toUpdate});

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( images ) {
        await queryRunner.manager.delete( ImagesProduct, { product: { id } });

        product.images = images.map( 
          image => this.productImageRepository.create({ url: image }) 
        )
      }
      
      // await this.productRepository.save( product );
      product.user = user;
      
      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id, updateProductDto.idClient!);
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string, idClient: string) {
    const product = await this.findOne( id, idClient );
      
    if(product){
        await this.productRepository.remove( product );
        return true;
     }
     else {
       throw new BadRequestException(`Producto not found`);
     }
       
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
