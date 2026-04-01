import { Injectable, NotFoundException } from '@nestjs/common';
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
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['category', 'employee'],
    });

    if (!asset) {
      throw new NotFoundException(`Asset with id "${id}" not found`);
    }

    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    const asset = await this.findOne(id);
    const { categoryId, ...assetData } = updateAssetDto;

    Object.assign(asset, assetData);

    if (categoryId !== undefined) {
      asset.category = { id: categoryId } as Asset['category'];
    }

    return await this.assetRepository.save(asset);
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    await this.assetRepository.remove(asset);

    return { message: `Asset with id "${id}" deleted successfully` };
  }
}
