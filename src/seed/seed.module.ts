import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersModule } from 'src/orders/orders.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule,
    OrdersModule,
    AuthModule
  ]
})
export class SeedModule {}
