import { Module } from '@nestjs/common';
import { DrugService } from './drug.service';
import { DrugController } from './drug.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [DrugController],
  providers: [DrugService],
})
export class DrugModule {}
