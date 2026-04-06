import { Injectable } from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { DatabaseService } from 'src/database/database.service';
import { SearchDrugDto } from './dto/search-drug.dto';

@Injectable()
export class DrugService {

  constructor (private readonly databaseService: DatabaseService){}

 async create(createDrugDto: CreateDrugDto) {
    return this.databaseService.drug.create({
      data: {
        name: createDrugDto.name,
      },
    });
  }


  // Get all drugs
  async findAll() {
    return this.databaseService.drug.findMany();
  }

  // Search drugs by name (partial match)
  async search(searchDrugDto: SearchDrugDto) {
    return this.databaseService.drug.findMany({
      where: {
        name: {
          contains: searchDrugDto.name,
          mode: 'insensitive',
        },
      },
    });
  }

}
