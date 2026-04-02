import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssetStatus } from '../../assets/entities/asset.entity';

export class ReturnAssignmentDto {
  @IsDateString()
  @IsOptional()
  returnedAt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  returnCondition?: string;

  @IsString()
  @IsOptional()
  returnNotes?: string;

  @IsEnum(AssetStatus)
  @IsOptional()
  nextAssetStatus?: AssetStatus;
}
