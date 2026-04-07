import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { DatabaseService } from 'src/database/database.service';
import { SearchDrugDto } from './dto/search-drug.dto';
import { PaginationDto } from './dto/pagination.dto';

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
  async findAll(paginationDto:PaginationDto) {
    const {limit, offset} = paginationDto;

    const drugs= await this.databaseService.drug.findMany({
      take:limit,
      skip:offset
    });
    const total = await this.databaseService.drug.count();

    return {
      data: drugs,
      total,
      limit,
      offset
    }
  }

  // drug.service.ts
  async findDrugsByNames(names: string[]) {
    return this.databaseService.drug.findMany({
      where: {
        name: {
          in: names,
          mode: 'insensitive',
        },
      },
    });
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

  async addDrugPic(id:number,imageUrl: string){
    const drug = await this.databaseService.drug.findUnique({ where: { id } });
  if (!drug) throw new NotFoundException('Drug not found');

    return this.databaseService.drug.update({
    where: { id },
    data: { image: imageUrl }
  });
  }

  



}
