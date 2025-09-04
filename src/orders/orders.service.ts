import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Between, Brackets, DataSource, In, Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities';
import { Order } from './entities/order.entity';
import { OrderAddress } from './entities/order-address.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {

    private readonly logger = new Logger('OrdersService');

    constructor(

      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

      @InjectRepository( Country )
      private readonly countryRepository: Repository<Country>,

      @InjectRepository( OrderItem )
      private readonly orderItemRepository: Repository<OrderItem>,

      @InjectRepository( UserAddress )
      private readonly addressUserRepository: Repository<UserAddress>,

      @InjectRepository( OrderAddress )
      private readonly orderAddressRepository: Repository<OrderAddress>,

      @InjectRepository( Order )
      private readonly orderRepository: Repository<Order>,

      private readonly dataSource: DataSource,
    ) {}

   async findAllCountries( ) {
      return await this.countryRepository.find(
        {
          order: {
            name: 'ASC'
          }
        }
      );
    }

  async create(createOrderDto: CreateOrderDto, user: User){

      // Obtener la información de los productos

const products = await this.productRepository
  .createQueryBuilder('product')
  .where('product.id IN (:...ids)', {
    ids: 
      createOrderDto.products.map(p => p.productId)
  })
  .andWhere('product.client.id = :client', { client: user.client.id })
  .getMany();

   if (products.length == 0) {
          throw new BadRequestException(`Productos no encontrados`);
        }
  // Calcular los montos // Encabezado
  const itemsInOrder = createOrderDto.products.reduce((count, p) => count + p.quantity, 0);

  // Los totales de tax, subtotal, y total
  const { subTotal, tax, total } = createOrderDto.products.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );


  // Crear la transacción de base de datos
  // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

            // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        //  Acumular los valores
        const productQuantity = createOrderDto.products
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }
        const cantidadNuevaStock = product.stock - productQuantity;

        // Verificar si el stock es negativo
        if (cantidadNuevaStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }

        return queryRunner.manager.update(Product, { id: product.id }, { stock: cantidadNuevaStock });
      });
       const updatedProducts = await Promise.all(updatedProductsPromises);  
      // 2. Crear la orden
      const order = queryRunner.manager.create( Order, {
        user,
        itemsInOrder,
        subTotal,
        tax,
        total,
        orderItem: createOrderDto.products.map( item => ({
          product: { id: item.productId },
          quantity: item.quantity,
          size: item.size,
          price: products.find( p => p.id === item.productId )?.price || 0,
        })),
        transactionId: uuidv4(),
        canal: createOrderDto.canal,
        client: user.client
      });

      const orderSaved = await queryRunner.manager.save(order);

      // 3. Crear la dirección de envío

        const { idCountry, ...restAddress } = createOrderDto.address;

        const country = await this.countryRepository.findOneBy({ id: idCountry });

        if (!country) {
          throw new BadRequestException(`Country with id ${idCountry} not found`);
        }

        const orderAddress = this.orderAddressRepository.create({
          ...restAddress,
          country,
          order: orderSaved,
        });
        const orderAddressSave = await queryRunner.manager.save(orderAddress);


      await queryRunner.commitTransaction();
      await queryRunner.release();

        return {
          ok: true,
          order: orderSaved,
          prismaTx: orderSaved.transactionId,
    }

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      
      return {
      ok: false,
      message: "Ha ocurrido un error al crear la orden",
    };
    }


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
  
  findAll(status: string | undefined,  fechaInicio: string , fechaFin: string ) {
    if (status === 'all') {
      status = undefined;
    }
    return this.orderRepository.find({
      relations: {
        orderAddress: true,
        orderItem: true,
        client: true
      },
      where: {
      ...(status ? { status } : {}), // 👈 solo aplica si status !== undefined
      createdAt: Between(new Date(fechaInicio), new Date(fechaFin)),
    },
    order: {
      createdAt: 'desc'
    },
    })
  }

  async findOrdersByUser(id: string, status: string, fechaInicio: string , fechaFin: string) {
  
return await this.orderRepository
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.user', 'user')
  .leftJoin('order.orderItem', 'orderItem')
  .leftJoinAndSelect('orderItem.product', 'product')
  .leftJoinAndSelect('product.images', 'images')
  .leftJoinAndSelect('order.orderAddress', 'orderAddress')
  .leftJoinAndSelect('order.client', 'client')
  .where('order.user = :id', { id })
  .andWhere(new Brackets(qb => {
  if (status !== 'all') {
    qb.andWhere('order.status = :status', { status });
  }
}))
    .andWhere('order.createdAt >= :fechaInicio', { fechaInicio: new Date(fechaInicio) })
    .andWhere('order.createdAt <= :fechaFin', { fechaFin: new Date(fechaFin) })
  .select([
    'order.id',        // solo este campo de Order
    'order.subTotal',        // solo este campo de Order
    'order.tax',        // solo este campo de Order
    'order.total',        // solo este campo de Order
    'order.itemsInOrder',        // solo este campo de Order
    'order.isPaid',        // solo este campo de Order
    'order.paidAt',        // solo este campo de Order
    'order.createdAt',        // solo este campo de Order 
    'order.status',
    'order.canal',
    'order.fechaEntrega',
    'order.fechaCancelacion',
    'order.fechaPreparacion',
    'order.fechaTermino',
    'orderItem.quantity',    // solo este campo de OrderItem
    'product',               // todos los campos de product
    'images',                // todos los campos de images
    'user.id',                  // todos los campos de user
    'orderAddress',
    'client'     
  ])
  .getMany();
  }

  async findOne(id: string) {
   return await this.orderRepository
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.user', 'user')
  .leftJoin('order.orderItem', 'orderItem')
  .leftJoinAndSelect('orderItem.product', 'product')
  .leftJoinAndSelect('product.images', 'images')
  .leftJoinAndSelect('order.orderAddress', 'orderAddress')
  .leftJoinAndSelect('order.client', 'client')
  .where('order.id = :id', { id })
  .select([
    'order.id',        // solo este campo de Order
    'order.subTotal',        // solo este campo de Order
    'order.tax',        // solo este campo de Order
    'order.total',        // solo este campo de Order
    'order.itemsInOrder',        // solo este campo de Order
    'order.isPaid',        // solo este campo de Order
    'order.paidAt',        // solo este campo de Order
    'order.createdAt',        // solo este campo de Order 
    'order.status',
    'order.canal',
    'order.fechaEntrega',
    'order.fechaCancelacion',
    'order.fechaPreparacion',
    'order.fechaTermino',
    'orderItem.quantity',    // solo este campo de OrderItem
    'product',               // todos los campos de product
    'images',                // todos los campos de images
    'user.id',                  // todos los campos de user
    'orderAddress',
    'client'        
  ])
  .getOne();
  }

  async updateOrder(updateOrderDto: UpdateOrderTransactionDto, id: string) {
    
    const orderExists = await this.orderRepository.findOneBy({ id });

    if (!orderExists) {
      throw new BadRequestException(`Order with id ${id} not found`);
    }

    if(updateOrderDto.transactionId !== undefined
       && updateOrderDto.transactionId !== null
      && updateOrderDto.transactionId !== '') {

       const {
           isPaid,
           paidAt,
          ...dataUpdate 
       } = updateOrderDto;

       const dateUpdateSave = await this.orderRepository.preload({ id, ...dataUpdate });  
                    
            if (!dateUpdateSave) {
              throw new BadRequestException('id order not found for update');
            }
            return await this.orderRepository.save( dateUpdateSave );
  }
  else if (updateOrderDto.isPaid !== undefined
       && updateOrderDto.isPaid !== null){

        const {
           transactionId,
          ...dataUpdate 
       } = updateOrderDto;

       const dateUpdateSave = await this.orderRepository.preload({ id, ...dataUpdate });  
                    
            if (!dateUpdateSave) {
              throw new BadRequestException('id order not found for update');
            }
            return await this.orderRepository.save( dateUpdateSave );
  }
    else {
      throw new BadRequestException('transactionId or isPaid is required for update');
    }
  }

  async updateOrderStatus(status: string, id: string) {
    
    const orderExists = await this.orderRepository.findOneBy({ id });

    if (!orderExists) {
      throw new BadRequestException(`Order with id ${id} not found`);
    }
      // get status
      //  cancelada, preparacion, entregada, terminada
      if(status === 'cancelada' ){
         const fechaCancelacion = new Date();

           const toUpdate = {
           status,
           fechaCancelacion
       };

       return await this.updateStatusOrderDb(id, toUpdate);
      }
      else if(status === 'preparacion' ){
          const fechaPreparacion = new Date();

           const toUpdate = {
           status,
           fechaPreparacion
       };

       return await this.updateStatusOrderDb(id, toUpdate);
      }
       else if(status === 'entregada' ){
         const fechaEntrega = new Date();

           const toUpdate = {
           status,
           fechaEntrega
       };

       return await this.updateStatusOrderDb(id, toUpdate);
       }
        else if(status === 'terminada' ){

          const fechaTermino = new Date();

           const toUpdate = {
           status,
           fechaTermino
       };

       return await this.updateStatusOrderDb(id, toUpdate);
        }
         else {
            throw new BadRequestException('Status Incorrecto');
         }  
  }

  private async updateStatusOrderDb(id: string, toUpdate: any) {
    
    const dateUpdateSave = await this.orderRepository.preload({ id, ...toUpdate });

    if (!dateUpdateSave) {
      throw new BadRequestException('id order not found for update');
    }
    return await this.orderRepository.save(dateUpdateSave);
  }

  async remove(id: string) {

    const order = await this.orderRepository.findOne( { where: { id }, relations: ['orderItem']});

    if(order){

      if(order.orderItem){
        order.orderItem.forEach(async element => {
   
        const product = await this.productRepository.findOneBy({ id: element.product.id });

      if (!product) throw new Error('Producto no encontrado');

      product.stock = product.stock + element.quantity;

      await this.productRepository.save(product);

        });
      }
        await this.orderAddressRepository.delete({ order });
        await this.orderItemRepository.delete({ order });
        await this.orderRepository.remove( order );
        return true;
     }
     else {
       throw new BadRequestException(`Order not found`);
     }
       
  }
}
