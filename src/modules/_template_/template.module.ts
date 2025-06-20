import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TemplateReadController } from "./presentation/controllers/template-read.controller";
import { TemplateWriteController } from "./presentation/controllers/template-write.controller";
import { CreateTemplateHandler } from "./application/handlers/create-template.handler";
import { UpdateTemplateHandler } from "./application/handlers/update-template.handler";
import { DeleteTemplateHandler } from "./application/handlers/delete-template.handler";
import { GetTemplateHandler, GetTemplatesHandler } from "./application/handlers/get-template.handler";
import { PrismaTemplateRepository } from "./infrastructure/repositories/prisma-template.repository";
import { TEMPLATE_REPOSITORY } from "./domain/repositories/template.repository";
import { TemplateKafkaProducer } from "./infrastructure/messaging/template.kafka-producer";
import { TemplateWebSocketGateway } from "./infrastructure/websocket/template-websocket.gateway";
import { WebSocketModule } from "../../infrastructure/websocket/websocket.module";
import { DatabaseModule } from "../../infrastructure/database/database.module";

@Module({
  imports: [CqrsModule, WebSocketModule, DatabaseModule],
  controllers: [TemplateReadController, TemplateWriteController],
  providers: [
    // Command Handlers
    CreateTemplateHandler,
    UpdateTemplateHandler,
    DeleteTemplateHandler,
    
    // Query Handlers
    GetTemplateHandler,
    GetTemplatesHandler,
    
    // Infrastructure
    TemplateKafkaProducer,
    TemplateWebSocketGateway,
    {
      provide: TEMPLATE_REPOSITORY,
      useClass: PrismaTemplateRepository,
    },
  ],
  exports: [TEMPLATE_REPOSITORY, TemplateKafkaProducer],
})
export class TemplateModule {}
