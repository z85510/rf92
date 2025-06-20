import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TemplateReadController } from "./controllers/template-read.controller";
import { TemplateWriteController } from "./controllers/template-write.controller";
import { TemplateService } from "./services/template.service";

@Module({
  imports: [CqrsModule],
  controllers: [TemplateReadController, TemplateWriteController],
  providers: [
    // Services
    TemplateService,
  ],
  exports: [TemplateService],
})
export class TemplateModule {}
