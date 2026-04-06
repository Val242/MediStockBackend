// pharmacy.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto, NearbyPharmacyDto } from './dto/create-pharmacy.dto';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // POST /pharmacies
  @Post()
  async create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.create(createPharmacyDto);
  }

  // GET /pharmacies
  @Get()
  async findAll() {
    return this.pharmacyService.findAll();
  }

  // GET /pharmacies/nearby?lat=..&lng=..
  @Get('nearby')
  async findNearby(@Query() query: NearbyPharmacyDto) {
    return this.pharmacyService.findNearby(query);
  }
}