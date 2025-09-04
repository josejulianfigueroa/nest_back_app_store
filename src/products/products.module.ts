import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { ImagesProduct } from 'src/images-product/entities/images-product.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
    imports: [
    TypeOrmModule.forFeature([ Product, ImagesProduct, ProductCategory, Client ]),
     AuthModule,
  ],
  exports: [
    ProductsService,
    TypeOrmModule,
  ]
})
export class ProductsModule {}
