import { 
  Controller, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtPayload } from '../../../common/guards/jwt-auth.guard';
import { CreateProductsCommand } from '../commands/create-products.command';
import { UpdateProductsCommand } from '../commands/update-products.command';
import { DeleteProductsCommand } from '../commands/delete-products.command';
import { CreateProductsDto } from '../dto/create-products.dto';
import { UpdateProductsDto } from '../dto/update-products.dto';
import { ProductsResponseDto } from '../dto/products-response.dto';

@ApiTags('productss')
@ApiBearerAuth('access-token')
@Controller('productss')
export class ProductsWriteController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a new products' })
  @ApiResponse({ 
    status: 201, 
    description: 'Products created successfully',
    type: ProductsResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Roles('user', 'admin')
  async create(
    @Body() createProductsDto: CreateProductsDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductsResponseDto> {
    return this.commandBus.execute(
      new CreateProductsCommand(createProductsDto, tenantId, user.sub)
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update products' })
  @ApiParam({ name: 'id', description: 'Products ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products updated successfully',
    type: ProductsResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Products not found' })
  @Roles('user', 'admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductsDto: UpdateProductsDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductsResponseDto> {
    return this.commandBus.execute(
      new UpdateProductsCommand(id, updateProductsDto, tenantId, user.sub)
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete products' })
  @ApiParam({ name: 'id', description: 'Products ID' })
  @ApiResponse({ status: 204, description: 'Products deleted successfully' })
  @ApiResponse({ status: 404, description: 'Products not found' })
  @Roles('admin')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteProductsCommand(id, tenantId, user.sub)
    );
  }
}