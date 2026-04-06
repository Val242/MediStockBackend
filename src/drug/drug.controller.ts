// drug.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DrugService } from './drug.service';
import { CreateDrugDto} from './dto/create-drug.dto';
import {SearchDrugDto}  from './dto/search-drug.dto'

@Controller('drugs')
export class DrugController {
  constructor(private readonly drugService: DrugService) {}

  // POST /drugs
  @Post()
  async create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugService.create(createDrugDto);
  }

  // GET /drugs
  @Get()
  async findAll() {
    return this.drugService.findAll();
  }

  // GET /drugs/search?name=para
  @Get('search')
  async search(@Query() query: SearchDrugDto) {
    return this.drugService.search(query);
  }
}