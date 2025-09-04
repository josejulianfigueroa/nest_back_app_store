import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationOffsetDto } from 'src/common/dto/pagination-offset.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @Auth()
  @ApiResponse({ status: 201, description: 'Product was created', type: Product  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user );
  }

  @Get('get/all/:idClient/listar')
  findAll( @Query() paginationDto:PaginationDto, 
  @Param( 'idClient', ParseUUIDPipe ) idClient: string ) {
    return this.productsService.findAll( paginationDto, idClient );
  }

   @Get('get/offset/:idClient/listar')
  findAllWithOffsetMobile( @Query() paginationDto:PaginationOffsetDto, 
  @Param( 'idClient', ParseUUIDPipe ) idClient: string ) {
    return this.productsService.findAllWithOffsetMobile( paginationDto, idClient );
  }

  @Get('get/one/:idClient/:term')
  findOne(@Param( 'term' ) term: string,
          @Param( 'idClient', ParseUUIDPipe ) idClient: string ) {
    return this.productsService.findOnePlain( term, idClient);
  }

  @Patch('update/:id')
  @Auth( ValidRoles.admin )
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update( id, updateProductDto, user );
  }

  @Delete('delete/:id/:idClient')
  @Auth( ValidRoles.admin )
  remove(@Param('id', ParseUUIDPipe ) id: string,  
  @Param( 'idClient', ParseUUIDPipe ) idClient: string ) {
    return this.productsService.remove( id, idClient );
  }

 
}
