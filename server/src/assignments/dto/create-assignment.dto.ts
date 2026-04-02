import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsDateString()
  @IsOptional()
  assignedAt?: string;

  @IsDateString()
  @IsOptional()
  expectedReturnDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  assignmentCondition?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
