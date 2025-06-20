import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteTemplateCommand } from '../commands/delete-template.command';
import { TemplateRepository, TEMPLATE_REPOSITORY } from '../../domain/repositories/template.repository';
import { TemplateKafkaProducer } from '../../infrastructure/messaging/template.kafka-producer';

@CommandHandler(DeleteTemplateCommand)
export class DeleteTemplateHandler implements ICommandHandler<DeleteTemplateCommand> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
    private producer: TemplateKafkaProducer,
  ) {}

  async execute(cmd: DeleteTemplateCommand): Promise<void> {
    const template = await this.repo.findById(cmd.id, cmd.tenantId);
    
    if (!template) {
      throw new NotFoundException(`Template with ID ${cmd.id} not found`);
    }

    await this.repo.delete(cmd.id, cmd.tenantId);
    await this.producer.publishTemplateDeleted(template.id, cmd.tenantId, cmd.userId);
  }
}