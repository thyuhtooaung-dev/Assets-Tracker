import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset, AssetStatus } from './entities/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const { categoryId, employeeId, ...assetData } = createAssetDto;

    const newAsset = this.assetRepository.create({
      ...assetData,
      category: { id: categoryId } as Asset['category'],
      ...(employeeId
        ? ({ employee: { id: employeeId } as Asset['employee'] } as Pick<
            Asset,
            'employee'
          >)
        : {}),
    });

    return await this.assetRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find({
      relations: ['category', 'employee'],
      order: {
        updatedAt: 'DESC',
      },
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

  async getStats() {
    const [totalAssets, totalAvailable, totalAssigned, totalBroken] =
      await Promise.all([
        this.assetRepository.count(),
        this.assetRepository.count({
          where: { status: AssetStatus.AVAILABLE },
        }),
        this.assetRepository.count({
          where: { status: AssetStatus.ASSIGNED },
        }),
        this.assetRepository.count({
          where: { status: AssetStatus.BROKEN },
        }),
      ]);

    return {
      totalAssets,
      totalAvailable,
      totalAssigned,
      totalBroken,
    };
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    const asset = await this.findOne(id);
    const { categoryId, employeeId, ...assetData } = updateAssetDto;

    const updatedAsset: Asset = {
      ...asset,
      ...assetData,
      ...(categoryId !== undefined
        ? ({ category: { id: categoryId } as Asset['category'] } as Pick<
            Asset,
            'category'
          >)
        : {}),
      ...(employeeId !== undefined
        ? employeeId === null
          ? ({ employee: null } as Pick<Asset, 'employee'>)
          : ({ employee: { id: employeeId } as Asset['employee'] } as Pick<
              Asset,
              'employee'
            >)
        : {}),
    };

    return await this.assetRepository.save(updatedAsset);
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    await this.assetRepository.remove(asset);

    return { message: `Asset with id "${id}" deleted successfully` };
  }
}
