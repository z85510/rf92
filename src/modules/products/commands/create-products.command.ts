import { CreateProductsDto } from '../dto/create-products.dto';

export class CreateProductsCommand {
  constructor(
    public readonly createProductsDto: CreateProductsDto,
    public readonly tenantId: string,
    public readonly userId: string,
  ) {}
}