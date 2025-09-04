import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class CategoriesService {
  
  private readonly logger = new Logger('CategoriesService');
  
    constructor(
  
      @InjectRepository( ProductCategory )
      private readonly categoryRepository: Repository<ProductCategory>,

      @InjectRepository(Client)
      private readonly clientRepository: Repository<Client>,
  
    ) {}

    
   async findAllCategories( idCliente: string) {

       const client = await this.clientRepository.findOne({
      where: { id: idCliente }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }
    
    return await this.categoryRepository.find({
      where: { client }
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {

    const client = await this.clientRepository.findOne({
         where: { id: createCategoryDto.idClient }
       });
   
       if(!client){
            throw new BadRequestException( "Cliente/Empresa no existe" );
       }

      const catValid = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, client }
    });

    if ( catValid ) 
      {  throw new BadRequestException( "Categoria ya existe" );    }

         const { idClient, ...categoryProductData } = createCategoryDto;

         const productCategory = this.categoryRepository.create({
           ...categoryProductData,
           client
         });
   
       return await this.categoryRepository.save( productCategory );
     
  }
/*
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }*/
}
