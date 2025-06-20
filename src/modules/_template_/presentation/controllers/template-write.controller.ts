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
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../../../common/decorators/current-tenant.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtPayload } from '../../../../common/guards/jwt-auth.guard';
import { CreateTemplateCommand } from '../../application/commands/create-template.command';
import { UpdateTemplateCommand } from '../../application/commands/update-template.command';
import { DeleteTemplateCommand } from '../../application/commands/delete-template.command';
import { CreateTemplateDto } from '../../dto/create-template.dto';
import { UpdateTemplateDto } from '../../dto/update-template.dto';
import { TemplateResponseDto } from '../../dto/template-response.dto';

@ApiTags('templates')
@ApiBearerAuth('access-token')
@Controller('templates')
export class TemplateWriteController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({ 
    status: 201, 
    description: 'Template created successfully',
    type: TemplateResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Roles('user', 'admin')
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TemplateResponseDto> {
    return this.commandBus.execute(
      new CreateTemplateCommand(createTemplateDto, tenantId, user.sub)
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Template updated successfully',
    type: TemplateResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Roles('user', 'admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TemplateResponseDto> {
    return this.commandBus.execute(
      new UpdateTemplateCommand(id, updateTemplateDto, tenantId, user.sub)
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 204, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Roles('admin')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteTemplateCommand(id, tenantId, user.sub)
    );
  }
}