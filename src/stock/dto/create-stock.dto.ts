// stock.dto.ts
import { IsInt, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  drugId: number;

  @IsInt()
  pharmacyId: number;

  @IsBoolean()
  isAvailable: boolean;
}


export class NearbyDrugStockDto {
 @IsNotEmpty()
  lat: number; // user latitude

  @IsNotEmpty()
  lng: number; // user longitude

  @IsNotEmpty()
  @IsNumber()
  drugId: number; // drug to search for
}

