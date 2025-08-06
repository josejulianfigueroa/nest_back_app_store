import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { ProductCategory } from 'src/products/entities';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    @InjectRepository( ProductCategory )
    private readonly categoryRepository: Repository<ProductCategory>
  ) {}



  async runSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers();

    const cat1 = await this.insertCategories();

    await this.insertNewProducts( adminUser, cat1 );
    

    return 'SEED EXECUTED';
  }

   private async insertCategories() {

    const seedCategories = initialData.categories;
    
    const categories: ProductCategory[] = [];

    seedCategories.forEach( cat => {
      categories.push( this.categoryRepository.create( cat ) )
    });

    const dbCats = await this.categoryRepository.save( categories )

    return dbCats[0];
  }

  private async insertUsers() {

    const seedUsers = initialData.users;
    
    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create( user ) )
    });

    const dbUsers = await this.userRepository.save( seedUsers )

    return dbUsers[0];
  }

  private async insertNewProducts( user: User, productCategory: ProductCategory ) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach( product => {
      product.productCategory = productCategory.id
      insertPromises.push( this.productsService.create( product , user,) );
    });

    await Promise.all( insertPromises );


    return true;
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder0 = this.categoryRepository.createQueryBuilder();
    await queryBuilder0
      .delete()
      .where({})
      .execute()

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  }

}
