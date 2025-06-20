import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTemplateCommand } from '../commands/create-template.command';
import { TemplateRepository, TEMPLATE_REPOSITORY } from '../../domain/repositories/template.repository';
import { Template } from '../../domain/entities/template.entity';
import { TemplateKafkaProducer } from '../../infrastructure/messaging/template.kafka-producer';

@CommandHandler(CreateTemplateCommand)
export class CreateTemplateHandler implements ICommandHandler<CreateTemplateCommand> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
    private producer: TemplateKafkaProducer,
  ) {}

  async execute(cmd: CreateTemplateCommand) {
    const template = Template.create(
      randomUUID(),
      cmd.data.name,
      cmd.data.description,
      cmd.data.tags || [],
      cmd.tenantId,
      cmd.userId,
    );

    await this.repo.save(template);
    await this.producer.publishTemplateCreated(template);

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