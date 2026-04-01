import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const newAsset = this.assetRepository.create({
      name: createAssetDto.name,
      serialNumber: createAssetDto.serialNumber,
      status: createAssetDto.status,
      category: { id: createAssetDto.categoryId },
    });
    return await this.assetRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find({
      relations: ['category', 'employee'],
    });
  }

  async findOne(id: string) {
    return await this.assetRepository.findOne({
      where: { id },
      relations: ['category', 'employee'],
    });
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: string) {
    return `This action removes a #${id} asset`;
  }
}
