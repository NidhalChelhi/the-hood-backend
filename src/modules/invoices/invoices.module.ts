import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { OrdersModule } from '../orders/orders.module';
import { User, UserSchema } from '../users/user.schema';
import { DeliveryNotesModule } from '../delivery-notes/delivery-notes.module';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name : Invoice.name, schema : InvoiceSchema },
      { name : User.name, schema : UserSchema }
    ]),
    OrdersModule,
    DeliveryNotesModule
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
