import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create/order')
  @Auth()
  create(
     @Body() createOrderDto: any,
     @GetUser() user: User,) {
    return this.ordersService.create(createOrderDto, user);
  }

    @Post('update/order/:orderId')
    @Auth()
    update(
    @Body() updateOrderDto: any,
    @Param('orderId') orderId: string) {
    return this.ordersService.updateOrder(updateOrderDto, orderId);
  }

    @Post('update/order/status/:orderId/:status')
    updateStatus(
    @Param('status') status: string,
    @Param('orderId') orderId: string) {
    return this.ordersService.updateOrderStatus(status, orderId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('user/order/:status/:fechaInicio/:fechaFin')
  @Auth()
  findOrdersByUser(
     @GetUser() user: User,
     @Param('status') status: string,
     @Param('fechaInicio') fechaInicio: string,
     @Param('fechaFin') fechaFin: string) {
    return this.ordersService.findOrdersByUser(user.id, status, fechaInicio, fechaFin);}

  @Get('get/all/:status/:fechaInicio/:fechaFin')
  findAll(@Param('status') status: string,
          @Param('fechaInicio') fechaInicio: string,
          @Param('fechaFin') fechaFin: string) {
    return this.ordersService.findAll( status, fechaInicio, fechaFin);
  }

  @Delete('delete/:id')
  @Auth()
    remove(@Param('id', ParseUUIDPipe ) id: string) {
        return this.ordersService.remove( id );
    }

   /**
     * 
     * Countries
     */
  @Get('countries/get')
    findAllCountries() {
      console.log('Fetching all countries');
      return this.ordersService.findAllCountries();
    }
  

    /**
     * 
     * AddressUser
     */

  @Post('address/user')
  @Auth()
  createUpdateAddressUser(
        @Body() createUserAddressDto: CreateUserAddressDto,
        @GetUser() user: User,
      ) {
        return this.ordersService.createUpdateAddressUser(createUserAddressDto, user );
      }

  @Delete('address/delete')
  @Auth()
  deleteAddressUser(  @GetUser() user: User,) {
    return this.ordersService.deleteAddressUser(user);
  }

  @Get('address/get')
  @Auth()
  getAddressUser(  @GetUser() user: User,) {
    return this.ordersService.getAddressUser(user);
  }
    
  }
