import { Template } from '../entities/template.entity';

export const TEMPLATE_REPOSITORY = Symbol('TEMPLATE_REPOSITORY');

export interface TemplateRepository {
  findById(id: string, tenantId: string): Promise<Template | null>;
  findByName(name: string, tenantId: string): Promise<Template | null>;
  findAll(tenantId: string, isActive?: boolean): Promise<Template[]>;
  findByTags(tags: string[], tenantId: string): Promise<Template[]>;
  save(template: Template): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
  exists(id: string, tenantId: string): Promise<boolean>;
}