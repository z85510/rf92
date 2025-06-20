import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetTemplateQuery, GetTemplatesQuery } from '../queries/get-template.query';
import { TemplateRepository, TEMPLATE_REPOSITORY } from '../../domain/repositories/template.repository';

@QueryHandler(GetTemplateQuery)
export class GetTemplateHandler implements IQueryHandler<GetTemplateQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
  ) {}

  async execute(query: GetTemplateQuery) {
    const template = await this.repo.findById(query.id, query.tenantId);
    
    if (!template) {
      throw new NotFoundException(`Template with ID ${query.id} not found`);
    }

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      tags: template.tags,
      isActive: template.isActive,
      tenantId: template.tenantId,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}

@QueryHandler(GetTemplatesQuery)
export class GetTemplatesHandler implements IQueryHandler<GetTemplatesQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
  ) {}

  async execute(query: GetTemplatesQuery) {
    let templates;

    if (query.tags && query.tags.length > 0) {
      templates = await this.repo.findByTags(query.tags, query.tenantId);
    } else {
      templates = await this.repo.findAll(query.tenantId, query.isActive);
    }

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      tags: template.tags,
      isActive: template.isActive,
      tenantId: template.tenantId,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    }));
  }
}