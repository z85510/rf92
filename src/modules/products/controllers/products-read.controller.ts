import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  ParseUUIDPipe,
  UseGuards 
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtPayload } from '../../../common/guards/jwt-auth.guard';
import { GetProductsQuery } from '../queries/get-products.query';
import { GetProductssQuery } from '../queries/get-productss.query';
import { ProductsResponseDto, PaginatedProductssResponseDto } from '../dto/products-response.dto';

@ApiTags('productss')
@ApiBearerAuth('access-token')
@Controller('productss')
export class ProductsReadController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get all productss' })
  @ApiResponse({ 
    status: 200, 
    description: 'Productss retrieved successfully',
    type: PaginatedProductssResponseDto 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @Roles('user', 'admin')
  async findAll(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedProductssResponseDto> {
    return this.queryBus.execute(
      new GetProductssQuery(tenantId, { page, limit, search })
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get products by ID' })
  @ApiParam({ name: 'id', description: 'Products ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products retrieved successfully',
    type: ProductsResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Products not found' })
  @Roles('user', 'admin')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductsResponseDto> {
    return this.queryBus.execute(new GetProductsQuery(id, tenantId));
  }
}