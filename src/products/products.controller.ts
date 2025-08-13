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
import { UpdateImagesProductDto } from './dto/update-images-product.dto';
import { PaginationOffsetDto } from 'src/common/dto/pagination-offset.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
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

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }

   @Get('list/offset')
  findAllWithOffsetMobile( @Query() paginationDto:PaginationOffsetDto ) {
    return this.productsService.findAllWithOffsetMobile( paginationDto );
  }

  
  @Get('categories/get/all')
  findAllCategories( ) {
    return this.productsService.findAllCategories( );
  }

  @Get(':term')
  findOne(@Param( 'term' ) term: string) {
    return this.productsService.findOnePlain( term );
  }

   @Get('images/:term')
  findOnebyImage(@Param( 'term' ) term: string) {
    return this.productsService.findOnebyImage( term );
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update( id, updateProductDto, user );
  }

   @Patch('images/update/:id')
  @Auth( ValidRoles.admin )
  updateImagesByProduct(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateImagesProductDto: UpdateImagesProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.updateImagesByProduct( id, updateImagesProductDto, user );
  }


  @Delete(':id')
  @Auth( ValidRoles.admin )
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productsService.remove( id );
  }

    @Delete('images/delete/:id')
  @Auth( ValidRoles.admin )
  removeImageById(@Param('id') id: string) {
    return this.productsService.removeImageById( id );
  }
}
