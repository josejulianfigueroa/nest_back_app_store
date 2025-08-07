import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
/*
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
*/
  
  @Get('countries')
    findAllCountries() {
      console.log('Fetching all countries');
      return this.ordersService.findAllCountries();
    }
  
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
