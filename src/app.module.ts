import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StockModule } from './stock/stock.module';
import { DrugModule } from './drug/drug.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { AiService } from './ai/ai.service';
import { AiController } from './ai/ai.controller';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [DatabaseModule, StockModule, DrugModule, PharmacyModule, AiModule],
  controllers: [AppController, AiController],
  providers: [AppService, AiService],
})
export class AppModule {}
