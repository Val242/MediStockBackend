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
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, StockModule, DrugModule, PharmacyModule, AiModule, CloudinaryModule],
  controllers: [AppController, AiController, CloudinaryController],
  providers: [AppService, AiService, CloudinaryService],
})
export class AppModule {}
