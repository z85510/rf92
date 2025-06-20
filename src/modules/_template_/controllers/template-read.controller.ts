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
import { GetTemplateQuery } from '../queries/get-template.query';
import { GetTemplatesQuery } from '../queries/get-templates.query';
import { TemplateResponseDto, PaginatedTemplatesResponseDto } from '../dto/template-response.dto';

@ApiTags('templates')
@ApiBearerAuth('access-token')
@Controller('templates')
export class TemplateReadController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ 
    status: 200, 
    description: 'Templates retrieved successfully',
    type: PaginatedTemplatesResponseDto 
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
  ): Promise<PaginatedTemplatesResponseDto> {
    return this.queryBus.execute(
      new GetTemplatesQuery(tenantId, { page, limit, search })
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Template retrieved successfully',
    type: TemplateResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Roles('user', 'admin')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TemplateResponseDto> {
    return this.queryBus.execute(new GetTemplateQuery(id, tenantId));
  }
}