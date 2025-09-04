import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessagesWsModule } from './message-ws/messages-ws.module';
import { OrdersModule } from './orders/orders.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { ClientsModule } from './clients/clients.module';
import { CategoriesModule } from './categories/categories.module';
import { ImagesProductModule } from './images-product/images-product.module';

@Module({
  imports: [
     ConfigModule.forRoot(),

     TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
              ? { rejectUnauthorized: false }
              : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
     }),

     ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),


     ProductsModule,

     CommonModule,

     SeedModule,

     FilesModule,

     AuthModule,

     MessagesWsModule,

     OrdersModule,

     PushNotificationModule,

     ClientsModule,

     CategoriesModule,

     ImagesProductModule,
  ],
})
export class AppModule {}
