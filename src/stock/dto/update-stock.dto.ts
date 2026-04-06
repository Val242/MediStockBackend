import { IsBoolean } from "class-validator";

export class UpdateStockDto {
  @IsBoolean()
  isAvailable: boolean;
}