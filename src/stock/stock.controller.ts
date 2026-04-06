// stock.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, NearbyDrugStockDto } from './dto/create-stock.dto';
import { UpdateStockDto} from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() dto: CreateStockDto) {
    return this.stockService.create(dto);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get('drug/:drugId')
  findByDrug(@Param('drugId') drugId: string) {
    return this.stockService.findByDrug(Number(drugId));
  }

  @Get('pharmacy/:pharmacyId')
  findByPharmacy(@Param('pharmacyId') pharmacyId: string) {
    return this.stockService.findByPharmacy(Number(pharmacyId));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.stockService.update(Number(id), dto);
  }

   @Get('nearest')
  async findNearestWithStock(@Query() query: NearbyDrugStockDto) {
    return this.stockService.findNearestWithStock(query);
  }  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(Number(id));
  }
}