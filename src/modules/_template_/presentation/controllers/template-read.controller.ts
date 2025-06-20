import { 
  Controller, 
  Get, 
  Param, 
  Query,
  ParseUUIDPipe 
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
import { CurrentTenant } from '../../../../common/decorators/current-tenant.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { GetTemplateQuery, GetTemplatesQuery } from '../../application/queries/get-template.query';
import { TemplateResponseDto } from '../../dto/template-response.dto';

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
    type: [TemplateResponseDto] 
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @Roles('user', 'admin')
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('isActive') isActive?: boolean,
    @Query('tags') tags?: string[],
  ): Promise<TemplateResponseDto[]> {
    return this.queryBus.execute(
      new GetTemplatesQuery(tenantId, isActive, tags)
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
  ): Promise<TemplateResponseDto> {
    return this.queryBus.execute(
      new GetTemplateQuery(id, tenantId)
    );
  }
}