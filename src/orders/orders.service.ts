import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class OrdersService {

    private readonly logger = new Logger('OrdersService');

    constructor(
      @InjectRepository( Country )
      private readonly countryRepository: Repository<Country>,

       @InjectRepository( UserAddress )
      private readonly addressUserRepository: Repository<UserAddress>
    ) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

   async findAllCountries( ) {
      return await this.countryRepository.find(
        {
          order: {
            name: 'ASC'
          }
        }
      );
    }

  async deleteAddressUser(user: User) {

  const query = this.addressUserRepository.createQueryBuilder('userAddress');

    try {
      return await query
        .delete()
        .where({user: user})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }

    async getAddressUser(user: User) {

  return await this.addressUserRepository.findOneBy({ user: user });
    
  }

 async createUpdateAddressUser(createUserAddressDto: CreateUserAddressDto, user: User) {

    try {

       const country = await this.countryRepository.findOneBy({ id: createUserAddressDto.idCountry });

      if ( !country ) {
        throw new BadRequestException(`Country with id ${ createUserAddressDto.idCountry } not found`);
      }

       const addressUser = await this.addressUserRepository.findOneBy({ user: user });
      
       const { idCountry, ...restCreateUserAdderess } = createUserAddressDto;

          if ( !addressUser ) {
            const addressUserSave = this.addressUserRepository.create({
            ...restCreateUserAdderess,
            country,
            user
          });
              return await this.addressUserRepository.save( addressUserSave );
          }
          else{
            const dataUpdate = {...createUserAddressDto,
                country
              };
            const addressUserSave = await this.addressUserRepository.preload({ id: addressUser.id, ...dataUpdate });  
                    
            if (!addressUserSave) {
              throw new BadRequestException('Address user not found for update');
            }
            return await this.addressUserRepository.save( addressUserSave );
          }
   
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

   private handleDBExceptions( error: any ) {
  
      if ( error.code === '23505' )
        throw new BadRequestException(error.detail);
      
      this.logger.error(error)
      // console.log(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
    
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
