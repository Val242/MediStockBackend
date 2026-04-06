import { Module } from '@nestjs/common';
import {AiService } from './ai.service';
import {AiController } from './ai.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DrugModule } from 'src/drug/drug.module';

@Module({
  imports: [DatabaseModule, DrugModule, AiModule],
  controllers: [AiController],
  exports: [AiService],
  providers: [AiService],
})
export class AiModule {}