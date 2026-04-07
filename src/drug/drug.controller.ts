// drug.controller.ts
import { Controller, Get, Post, Body, Query, Patch, BadRequestException, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DrugService } from './drug.service';
import { CreateDrugDto} from './dto/create-drug.dto';
import {SearchDrugDto}  from './dto/search-drug.dto'
import { PaginationDto } from './dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('drugs')
export class DrugController {
  constructor(private readonly drugService: DrugService, private cloudinaryService:CloudinaryService) {}

  // POST /drugs
  @Post()
  async create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugService.create(createDrugDto);
  }

  // GET /drugs
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.drugService.findAll(paginationDto);
  }

 

  // GET /drugs/search?name=para
  @Get('search')
  async search(@Query() query: SearchDrugDto) {
    return this.drugService.search(query);
  }

@Patch(':id/drug-picture')
@UseInterceptors(FileInterceptor('file'))
async updateProfilePic(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File
) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  const uploaded = await this.cloudinaryService.uploadFile(file);

  return this.drugService.addDrugPic(
    +id,
    uploaded.secure_url // ✅ THIS is what matters
  );
}
}

