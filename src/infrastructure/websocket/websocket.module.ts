import { Module } from "@nestjs/common";
import { BaseWebSocketGateway } from "./websocket.gateway";
import { WebSocketService } from "./websocket.service";
import { WebSocketController } from "./websocket.controller";

@Module({
  providers: [BaseWebSocketGateway, WebSocketService],
  controllers: [WebSocketController],
  exports: [BaseWebSocketGateway, WebSocketService],
})
export class WebSocketModule {}
