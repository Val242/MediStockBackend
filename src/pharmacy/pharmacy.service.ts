// pharmacy.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePharmacyDto, NearbyPharmacyDto } from './dto/create-pharmacy.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PharmacyService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly MAX_SEARCH_RADIUS_KM = 25; // Adjust as needed

  // Create a new pharmacy
  async create(createPharmacyDto: CreatePharmacyDto) {
    return this.databaseService.pharmacy.create({
      data: createPharmacyDto,
    });
  }

  // Get all pharmacies
  async findAll() {
    return this.databaseService.pharmacy.findMany();
  }

  // Optional: find nearby pharmacies (using simple distance calculation)
  // Define a constant for max search radius (in km)


  async findNearby(userLocation: NearbyPharmacyDto) {
    // Convert strings to numbers safely
    const userLat = Number(userLocation.lat);
    const userLng = Number(userLocation.lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      throw new Error('Invalid user coordinates');
    }

    // Fetch all pharmacies from the database
    const pharmacies = await this.databaseService.pharmacy.findMany();

    // Calculate distance for each pharmacy
    const withDistance = pharmacies
      .map((p) => {
        const distance = this.calculateDistance(userLat, userLng, p.latitude, p.longitude);
        return { ...p, distance };
      })
      // Optional: filter within MAX_SEARCH_RADIUS_KM
      .filter((p) => p.distance <= this.MAX_SEARCH_RADIUS_KM);

    // Sort nearest first
    return withDistance.sort((a, b) => a.distance - b.distance);
  }

  // Haversine formula to calculate distance in km
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

    async addPharmacyPic(id:number,imageUrl: string){
      const pharmacy = await this.databaseService.pharmacy.findUnique({ where: { id } });
    if (!pharmacy) throw new NotFoundException('Pharmacy not found');
  
      return this.databaseService.pharmacy.update({
      where: { id },
      data: { image: imageUrl }
    });

    
}}