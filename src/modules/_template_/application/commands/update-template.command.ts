import { UpdateTemplateDto } from '../../dto/update-template.dto';

export class UpdateTemplateCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateTemplateDto,
    public readonly tenantId: string,
    public readonly userId: string,
  ) {}
}