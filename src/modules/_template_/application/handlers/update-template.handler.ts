import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateTemplateCommand } from '../commands/update-template.command';
import { TemplateRepository, TEMPLATE_REPOSITORY } from '../../domain/repositories/template.repository';
import { TemplateKafkaProducer } from '../../infrastructure/messaging/template.kafka-producer';

@CommandHandler(UpdateTemplateCommand)
export class UpdateTemplateHandler implements ICommandHandler<UpdateTemplateCommand> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
    private producer: TemplateKafkaProducer,
  ) {}

  async execute(cmd: UpdateTemplateCommand) {
    const template = await this.repo.findById(cmd.id, cmd.tenantId);
    
    if (!template) {
      throw new NotFoundException(`Template with ID ${cmd.id} not found`);
    }

    template.update(
      cmd.data.name,
      cmd.data.description,
      cmd.data.tags,
      cmd.data.isActive,
      cmd.userId,
    );

    await this.repo.save(template);
    await this.producer.publishTemplateUpdated(template);

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