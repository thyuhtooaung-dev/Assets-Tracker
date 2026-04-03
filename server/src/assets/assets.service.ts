import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset, AssetStatus } from './entities/asset.entity';
import { Repository } from 'typeorm';

const ASSET_RELATIONS = ['category', 'employee'] as const;

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const { categoryId, ...assetData } = createAssetDto;

    if (assetData.status === AssetStatus.ASSIGNED) {
      throw new BadRequestException(
        'Use /assignments to assign assets to employees',
      );
    }

    const newAsset = this.assetRepository.create({
      ...assetData,
      category: { id: categoryId } as Asset['category'],
    });

    return this.assetRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({
      relations: [...ASSET_RELATIONS],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: [...ASSET_RELATIONS],
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
    const { categoryId, status, ...assetData } = updateAssetDto;

    if (
      status === AssetStatus.ASSIGNED &&
      asset.status !== AssetStatus.ASSIGNED
    ) {
      throw new BadRequestException(
        'Use /assignments to assign assets to employees',
      );
    }

    if (
      asset.status === AssetStatus.ASSIGNED &&
      status !== undefined &&
      status !== AssetStatus.ASSIGNED
    ) {
      throw new BadRequestException(
        'Use /assignments to return an assigned asset before changing its status',
      );
    }

    const updatedAsset: Asset = {
      ...asset,
      ...assetData,
      ...(status !== undefined ? ({ status } as Pick<Asset, 'status'>) : {}),
      ...(categoryId !== undefined
        ? ({ category: { id: categoryId } as Asset['category'] } as Pick<
            Asset,
            'category'
          >)
        : {}),
    };

    return this.assetRepository.save(updatedAsset);
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    await this.assetRepository.remove(asset);

    return { message: `Asset with id "${id}" deleted successfully` };
  }
}
