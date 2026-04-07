// pharmacy.controller.ts
import { Controller, Get, Post, Body, Query, Patch, UseInterceptors, Param, UploadedFile, BadRequestException } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto, NearbyPharmacyDto } from './dto/create-pharmacy.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService, private cloudinaryService: CloudinaryService) {}

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


  @Get(':id/available-drugs')
  async getAvailableDrugs(@Param('id') id: string){
      return this.pharmacyService.getAvailableDrugs(+id)
  }

  @Patch(':id/pharmacy-picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePic(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
  
    const uploaded = await this.cloudinaryService.uploadFile(file);
  
    return this.pharmacyService.addPharmacyPic(
      +id,
      uploaded.secure_url 
    );
  }
}