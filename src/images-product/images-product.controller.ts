import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ImagesProductService } from './images-product.service';
import { CreateImagesProductDto } from './dto/create-images-product.dto';
import { UpdateImagesProductDto } from './dto/update-images-product.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ImagenesProduct')
@Controller('images-product')
export class ImagesProductController {
  constructor(private readonly imagesProductService: ImagesProductService) {}

  @Delete('delete/:id')
  @Auth( ValidRoles.admin )
  removeImageById(@Param('id') id: string) {
    return this.imagesProductService.removeImageById( id );
  }

  @Patch('update/:id')
  @Auth( ValidRoles.admin )
  updateImagesByProduct(
      @Param('id', ParseUUIDPipe ) id: string, 
      @Body() updateImagesProductDto: UpdateImagesProductDto,
      @GetUser() user: User,
  ) {
      return this.imagesProductService.updateImagesByProduct( id, updateImagesProductDto, user );
    }
/*
  @Get('get/:term')
  findOnebyImage(@Param( 'term' ) term: string) {
    return this.imagesProductService.findOnebyImage( term );
  }
*/
}
