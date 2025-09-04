import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { Country } from 'src/orders/entities/country.entity';
import { UserAddress } from 'src/orders/entities/user-address.entity';
import { OrderAddress } from 'src/orders/entities/order-address.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductCategory } from 'src/categories/entities/product-category.entity';
import { ImagesProduct } from 'src/images-product/entities/images-product.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    @InjectRepository( ProductCategory )
    private readonly categoryRepository: Repository<ProductCategory>,

    @InjectRepository( Country )
    private readonly countryRepository: Repository<Country>,

    @InjectRepository( UserAddress )
    private readonly userAddressRepository: Repository<UserAddress>,

    @InjectRepository( OrderAddress )
    private readonly orderAddressRepository: Repository<OrderAddress>,

    @InjectRepository( OrderItem )
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository( Order )
    private readonly orderRepository: Repository<Order>,

    @InjectRepository( ImagesProduct )
    private readonly productImageRepository: Repository<ImagesProduct>
  ) {}



  async runSeed() {

    await this.deleteTables();

    const adminUser = await this.insertUsers();

    const cat1 = await this.insertCategories();

    await this.insertCountries();

    await this.insertNewProducts( adminUser, cat1 );
    

    return 'SEED EXECUTED';
  }

    private async insertCountries() {

    const seedCountries = initialData.countries;
    
    const countries: Country[] = [];

    seedCountries.forEach( cou => {
      countries.push( this.countryRepository.create( cou ) )
    });

    await this.countryRepository.save( countries );

    return;
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

    const products = initialData.products.map( item => ({
      ...item,
      stars: 5,
      opciones_entrega: ['delivery'],
      idProductCategory : productCategory.id,
      idClient : 'a37dca4c-69cc-43bd-b22f-7a50e37c2b7e',
    }));

    const insertPromises: Promise<any>[] = [];

    products.forEach( product => {
      insertPromises.push( this.productsService.create( product , user,) );
    });

    await Promise.all( insertPromises );


    return true;
  }

  private async deleteTables() {


const queryBuilder02 = this.productImageRepository.createQueryBuilder();
    await queryBuilder02
      .delete()
      .where({})
      .execute()

   const queryBuilder4 = this.orderAddressRepository.createQueryBuilder();
    await queryBuilder4
      .delete()
      .where({})
      .execute()

  const queryBuilder2 = this.userAddressRepository.createQueryBuilder();
    await queryBuilder2
      .delete()
      .where({})
      .execute()

  const queryBuilder3 = this.orderItemRepository.createQueryBuilder();
    await queryBuilder3
      .delete()
      .where({})
      .execute()



   await this.productsService.deleteAllProducts();

    const queryBuilder0 = this.categoryRepository.createQueryBuilder();
    await queryBuilder0
      .delete()
      .where({})
      .execute()




    const queryBuilder1 = this.countryRepository.createQueryBuilder();
    await queryBuilder1
      .delete()
      .where({})
      .execute()
    
    const queryBuilder5 = this.orderRepository.createQueryBuilder();
    await queryBuilder5
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
