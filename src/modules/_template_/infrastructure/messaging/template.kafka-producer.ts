import { Injectable } from '@nestjs/common';
import { Template } from '../../domain/entities/template.entity';

@Injectable()
export class TemplateKafkaProducer {
  // TODO: Implement Kafka client injection when available

  async publishTemplateCreated(template: Template): Promise<void> {
    // TODO: Implement Kafka message publishing
    console.log(`Template created event: ${template.id}`);
  }

  async publishTemplateUpdated(template: Template): Promise<void> {
    // TODO: Implement Kafka message publishing
    console.log(`Template updated event: ${template.id}`);
  }

  async publishTemplateDeleted(templateId: string, tenantId: string, userId: string): Promise<void> {
    // TODO: Implement Kafka message publishing
    console.log(`Template deleted event: ${templateId}`);
  }
}