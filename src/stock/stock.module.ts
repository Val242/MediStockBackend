import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AiModule } from 'src/ai/ai.module';
import { DrugService } from 'src/drug/drug.service';
import { DrugModule } from 'src/drug/drug.module';

@Module({
  imports: [DatabaseModule, AiModule, DrugModule],
  controllers: [StockController],
  providers: [StockService, DrugService],
})
export class StockModule {}
