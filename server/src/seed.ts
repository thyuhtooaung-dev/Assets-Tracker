import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetStatus } from './assets/entities/asset.entity';
import { Category } from './categories/entities/category.entity';
import { Employee } from './employees/entities/employee.entity';
import {
  Assignment,
  AssignmentStatus,
} from './assignments/entities/assignment.entity';
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
  const assignmentRepo = app.get<Repository<Assignment>>(
    getRepositoryToken(Assignment),
  );

  await assignmentRepo.createQueryBuilder().delete().from(Assignment).execute();
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

    assets.push(
      assetRepo.create({
        name: faker.commerce.productName(),
        serialNumber: `SN-${faker.string.alphanumeric(8).toUpperCase()}`,
        status: AssetStatus.AVAILABLE,
        category: randomCategory,
        employee: null,
      }),
    );
  }
  await assetRepo.save(assets);

  const assignments: Assignment[] = [];

  for (const asset of assets) {
    const shouldCreateActiveAssignment = Math.random() > 0.45;

    if (shouldCreateActiveAssignment) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      const assignedAt = faker.date.recent({ days: 45 });

      assignments.push(
        assignmentRepo.create({
          asset,
          employee,
          assignedAt,
          expectedReturnDate: faker.date.soon({
            days: 30,
            refDate: assignedAt,
          }),
          status: AssignmentStatus.ACTIVE,
          assignmentCondition: faker.helpers.arrayElement([
            'New',
            'Good',
            'Minor wear',
          ]),
          notes: faker.lorem.sentence(),
        }),
      );

      asset.employee = employee;
      asset.status = AssetStatus.ASSIGNED;
      continue;
    }

    const shouldCreateReturnedAssignment = Math.random() > 0.5;

    if (shouldCreateReturnedAssignment) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      const assignedAt = faker.date.past({ years: 1 });

      assignments.push(
        assignmentRepo.create({
          asset,
          employee,
          assignedAt,
          expectedReturnDate: faker.date.soon({
            days: 30,
            refDate: assignedAt,
          }),
          returnedAt: faker.date.between({ from: assignedAt, to: new Date() }),
          status: AssignmentStatus.RETURNED,
          assignmentCondition: faker.helpers.arrayElement([
            'Good',
            'Minor wear',
            'Well used',
          ]),
          returnCondition: faker.helpers.arrayElement([
            'Good',
            'Minor wear',
            'Needs maintenance',
          ]),
          notes: faker.lorem.sentence(),
          returnNotes: faker.lorem.sentence(),
        }),
      );
    }
  }

  await assetRepo.save(assets);
  await assignmentRepo.save(assignments);

  console.log('✅ Seeded Successfully');
  await app.close();
}

void bootstrap();
