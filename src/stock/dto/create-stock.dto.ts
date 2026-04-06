// stock.dto.ts
import { IsInt, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';


import { Transform } from 'class-transformer';

export class CreateStockDto {
  @IsInt()
  drugId: number;

  @IsInt()
  pharmacyId: number;

  @IsBoolean()
  isAvailable: boolean;
}


export class NearbyDrugStockDto {
  @Transform(({ value }) => parseFloat(value)) // Converts string to number automatically
  @IsNumber()
  drugId: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng: number;
}

