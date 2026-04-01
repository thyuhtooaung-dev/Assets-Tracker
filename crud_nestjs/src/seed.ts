import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetStatus } from './assets/entities/asset.entity';
import { Category } from './categories/entities/category.entity';
import { Employee } from './employees/entities/employee.entity';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  console.log('🌱 Seeding... Please Wait..');

  const app = await NestFactory.createApplicationContext(AppModule);

  const assetRepo = app.get<Repository<Asset>>(getRepositoryToken(Asset));
  const categoryRepo = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const employeeRepo = app.get<Repository<Employee>>(
    getRepositoryToken(Employee),
  );

  await assetRepo.createQueryBuilder().delete().from(Asset).execute();
  await categoryRepo.createQueryBuilder().delete().from(Category).execute();
  await employeeRepo.createQueryBuilder().delete().from(Employee).execute();

  const categories = await categoryRepo.save([
    { name: 'Laptop' },
    { name: 'Monitor' },
    { name: 'Mobile' },
    { name: 'Furniture' },
  ]);

  const employees: Employee[] = [];
  for (let i = 0; i < 10; i++) {
    employees.push(
      employeeRepo.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        department: faker.commerce.department(),
      }),
    );
  }
  await employeeRepo.save(employees);

  const assets: Asset[] = [];
  for (let i = 0; i < 20; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomEmployee =
      Math.random() > 0.3
        ? employees[Math.floor(Math.random() * employees.length)]
        : null;
    const status = randomEmployee
      ? AssetStatus.ASSIGNED
      : AssetStatus.AVAILABLE;

    assets.push(
      assetRepo.create({
        name: faker.commerce.productName(),
        serialNumber: `SN-${faker.string.alphanumeric(8).toUpperCase()}`,
        status: status,
        category: randomCategory,
        employee: randomEmployee,
      }),
    );
  }
  await assetRepo.save(assets);

  console.log('✅ Seeded Successfully');
  await app.close();
}

bootstrap();
