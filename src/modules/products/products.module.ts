import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsReadController } from './controllers/products-read.controller';
import { ProductsWriteController } from './controllers/products-write.controller';
import { ProductsService } from './services/products.service';
import { ProductsQueryService } from './services/products-query.service';
import { CreateProductsHandler } from './handlers/create-products.handler';
import { UpdateProductsHandler } from './handlers/update-products.handler';
import { DeleteProductsHandler } from './handlers/delete-products.handler';
import { GetProductsHandler } from './handlers/get-products.handler';
import { GetProductssHandler } from './handlers/get-productss.handler';

@Module({
  imports: [CqrsModule],
  controllers: [
    ProductsReadController,
    ProductsWriteController,
  ],
  providers: [
    // Services
    ProductsService,
    ProductsQueryService,
    
    // Command Handlers
    CreateProductsHandler,
    UpdateProductsHandler,
    DeleteProductsHandler,
    
    // Query Handlers
    GetProductsHandler,
    GetProductssHandler,
  ],
  exports: [ProductsService, ProductsQueryService],
})
export class ProductsModule {}