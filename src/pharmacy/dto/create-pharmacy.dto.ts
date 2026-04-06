import { IsNumberString } from 'class-validator';

export class CreatePharmacyDto {
  name: string;           // Pharmacy name
  latitude: number;       // GPS latitude
  longitude: number;      // GPS longitude
  address?: string;       // Optional full text address
  phone?: string;         // Optional contact number
  google_place_id?: string; // Optional for future Google Maps integration
}

// pharmacy.dto.ts


export class NearbyPharmacyDto {
  @IsNumberString()
  lat: string;

  @IsNumberString()
  lng: string;
}