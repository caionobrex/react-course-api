import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProductsService } from './products.service';

export class CreateProductDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  imgSrc: string;
}

export class ProductsResponse extends CreateProductDTO {
  @ApiProperty()
  id: number;
}

@ApiTags('produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({
    type: [ProductsResponse],
  })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: ProductsResponse,
  })
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.productsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Sem autorização.' })
  @ApiBadRequestResponse({ description: 'Corpo invalido.' })
  @ApiConflictResponse({ description: 'Nome já cadastrado.' })
  @ApiCreatedResponse({
    description: 'Criado com sucesso!',
  })
  async create(@Body() body: CreateProductDTO) {
    return await this.productsService.create(body);
  }
}
