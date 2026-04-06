// stock.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto, NearbyDrugStockDto} from './dto/create-stock.dto';
import {UpdateStockDto } from './dto/update-stock.dto'
import { DatabaseService } from 'src/database/database.service';
import { AiService } from 'src/ai/ai.service';
import { DrugService } from 'src/drug/drug.service';
import { calculateDistance } from 'utils/distance';

@Injectable()
export class StockService {
  constructor(private databaseService: DatabaseService,private aiService: AiService, private drugService: DrugService) {}
   private readonly MAX_SEARCH_RADIUS_KM = 25;

  async create(createStockDto: CreateStockDto) {
    return this.databaseService.stock.create({
      data: {
        drugId: createStockDto.drugId,
        pharmacyId: createStockDto.pharmacyId,
        isAvailable: createStockDto.isAvailable,
      },
    });
  }

    

  async findAll() {
    return this.databaseService.stock.findMany({
      include: { drug: true, pharmacy: true },
    });
  }

  async findByDrug(drugId: number) {
    return this.databaseService.stock.findMany({
      where: { drugId },
      include: { pharmacy: true },
    });
  }

  async findByPharmacy(pharmacyId: number) {
    return this.databaseService.stock.findMany({
      where: { pharmacyId },
      include: { drug: true },
    });
  }

  // stock.service.ts

    async findAvailableStock(drugIds: number[]) {
      return this.databaseService.stock.findMany({
        where: {
          drugId: {
            in: drugIds,
          },
        },
        include: {
          pharmacy: true, // get pharmacy info
          drug: true,     // get drug info
        },
      });
    }

  async update(id: number, dto: UpdateStockDto) {
    const stock = await this.databaseService.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException('Stock record not found');

    return this.databaseService.stock.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
    });
  }

    async findNearestWithStock(userInput: NearbyDrugStockDto) {
      // 1️⃣ Convert coordinates to numbers
      const userLat = Number(userInput.lat);
      const userLng = Number(userInput.lng);

      if (isNaN(userLat) || isNaN(userLng)) {
        throw new Error('Invalid user coordinates');
      }

      // 2️⃣ Parse drugId safely
      const drugId = parseInt(userInput.drugId as any, 10);
      if (isNaN(drugId)) {
        throw new Error('Invalid drugId');
      }

      // 3️⃣ Find all stock records where the drug is available
      const availableStocks = await this.databaseService.stock.findMany({
        where: {
          drugId,
          isAvailable: true,
        },
        include: {
          pharmacy: true, // Include pharmacy details
          drug:true
        },
      });

        

      // 4️⃣ Map pharmacies with distance
      const withDistance = availableStocks.map((stock) => {
        const p = stock.pharmacy;
        const distance = this.calculateDistance(userLat, userLng, p.latitude, p.longitude);
        return {
          pharmacyId: p.id,
          name: p.name,
          address: p.address,
          latitude: p.latitude,
          longitude: p.longitude,
          distance,
        };
      })
      // 5️⃣ Filter by max radius (optional)
      .filter((p) => p.distance <= this.MAX_SEARCH_RADIUS_KM);

      // 6️⃣ Sort nearest first
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
  
    
      // stock.service.ts
  async smartSearch(userInput: {text:string}, userLat: number, userLng: number) {
    // 1️⃣ AI extraction
    const aiResult = await this.aiService.extractDrugsAndSymptoms(userInput);
    const drugNames = aiResult.drugs;

    if (!drugNames || drugNames.length === 0) {
      return { message: 'No drugs identified from input' };
    }

    // 2️⃣ Find drugs in DB
    const drugs = await this.drugService.findDrugsByNames(drugNames);

    if (drugs.length === 0) {
      return { message: 'No matching drugs in database' };
    }

    const drugIds = drugs.map(d => d.id);

    // 3️⃣ Get available stock
    const stocks = await this.findAvailableStock(drugIds);

    // 4️⃣ Map + calculate distance
    const mapped = stocks.map(stock => ({
      pharmacyId: stock.pharmacy.id,
      pharmacy: stock.pharmacy.name,
      lat: stock.pharmacy.latitude,
      lng: stock.pharmacy.longitude,
      drug: stock.drug.name,
      distance: calculateDistance(
        userLat,
        userLng,
        stock.pharmacy.latitude,
        stock.pharmacy.longitude,
      ),
    }));

    // 5️⃣ Group by pharmacy
    const grouped = {};

    mapped.forEach(item => {
      if (!grouped[item.pharmacyId]) {
        grouped[item.pharmacyId] = {
          pharmacy: item.pharmacy,
          distance: item.distance,
          availableDrugs: [],
        };
      }

      grouped[item.pharmacyId].availableDrugs.push(item.drug);

      // keep shortest distance
      if (item.distance < grouped[item.pharmacyId].distance) {
        grouped[item.pharmacyId].distance = item.distance;
      }
    });

    // 6️⃣ Convert to array
    const result = Object.values(grouped);

    // 7️⃣ Rank (distance + number of drugs)
    result.sort((a: any, b: any) => {
      const scoreA = a.availableDrugs.length * 2 - a.distance;
      const scoreB = b.availableDrugs.length * 2 - b.distance;
      return scoreB - scoreA;
    });

    return result;
  }

// stock.service.ts



  async remove(id: number) {
    const stock = await this.databaseService.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException('Stock record not found');

    return this.databaseService.stock.delete({ where: { id } });
  }
}