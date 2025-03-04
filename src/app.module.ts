import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthCompositeGuard } from "./common/guards/auth-composite.guard";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { ProductsModule } from "./modules/products/products.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { DeliveryNotesModule } from "./modules/delivery-notes/delivery-notes.module";
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ProductsModule,
    SuppliersModule,
    ClientsModule,
    OrdersModule,
    DeliveryNotesModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: AuthCompositeGuard,
    },
  ],
})
export class AppModule {}
