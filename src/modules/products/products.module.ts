import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductsReadController } from "./controllers/products-read.controller";
import { ProductsWriteController } from "./controllers/products-write.controller";
import { ProductsService } from "./services/products.service";

@Module({
  imports: [CqrsModule],
  controllers: [ProductsReadController, ProductsWriteController],
  providers: [
    // Services
    ProductsService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
