import { CreateTemplateDto } from '../dto/create-template.dto';

export class CreateTemplateCommand {
  constructor(
    public readonly createTemplateDto: CreateTemplateDto,
    public readonly tenantId: string,
    public readonly userId: string,
  ) {}
}