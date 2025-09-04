import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ProductCategory } from './entities/product-category.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
      TypeOrmModule.forFeature([ Client, ProductCategory ])],

})
export class CategoriesModule {}
