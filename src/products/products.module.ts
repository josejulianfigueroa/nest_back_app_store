import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategory, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
    imports: [
    TypeOrmModule.forFeature([ Product, ProductImage, ProductCategory ]),
     AuthModule,
  ],
  exports: [
    ProductsService,
    TypeOrmModule,
  ]
})
export class ProductsModule {}
