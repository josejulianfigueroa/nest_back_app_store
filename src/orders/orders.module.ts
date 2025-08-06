import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Country } from './entities/country.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Order } from './entities/order.entity';
import { OrderAddress } from './entities/order-address.entity';
import { UserAddress } from './entities/user-address.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
    imports: [
    TypeOrmModule.forFeature([ Country, Order, OrderItem, OrderAddress, UserAddress]),
     AuthModule,
  ],
  exports: [
    OrdersService,
    TypeOrmModule,
  ]
})
export class OrdersModule {}
