import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TemplateReadController } from './controllers/template-read.controller';
import { TemplateWriteController } from './controllers/template-write.controller';
import { TemplateService } from './services/template.service';
import { TemplateQueryService } from './services/template-query.service';
import { CreateTemplateHandler } from './handlers/create-template.handler';
import { UpdateTemplateHandler } from './handlers/update-template.handler';
import { DeleteTemplateHandler } from './handlers/delete-template.handler';
import { GetTemplateHandler } from './handlers/get-template.handler';
import { GetTemplatesHandler } from './handlers/get-templates.handler';

@Module({
  imports: [CqrsModule],
  controllers: [
    TemplateReadController,
    TemplateWriteController,
  ],
  providers: [
    // Services
    TemplateService,
    TemplateQueryService,
    
    // Command Handlers
    CreateTemplateHandler,
    UpdateTemplateHandler,
    DeleteTemplateHandler,
    
    // Query Handlers
    GetTemplateHandler,
    GetTemplatesHandler,
  ],
  exports: [TemplateService, TemplateQueryService],
})
export class TemplateModule {}