import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDTO } from './products.controller';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findById(id: number) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: CreateProductDTO) {
    const product = await this.prisma.product.findUnique({
      where: { name: data.name },
    });
    if (product) {
      throw new ConflictException('Produto já existe');
    }
    return await this.prisma.product.create({ data });
  }
}
