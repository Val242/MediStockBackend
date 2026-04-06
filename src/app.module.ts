import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StockModule } from './stock/stock.module';
import { DrugModule } from './drug/drug.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
  imports: [DatabaseModule, StockModule, DrugModule, PharmacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
