import { Module } from '@nestjs/common';
import { ImagesProductService } from './images-product.service';
import { ImagesProductController } from './images-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { ImagesProduct } from './entities/images-product.entity';
import { Product } from 'src/products/entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImagesProductController],
  providers: [ImagesProductService],
  imports: [
        TypeOrmModule.forFeature([ Client, Product, ImagesProduct, ProductCategory ]),
        AuthModule]
        
  
})
export class ImagesProductModule {}
