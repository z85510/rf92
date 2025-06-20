import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { WebSocketService } from "./websocket.service";

@ApiTags("WebSocket")
@Controller("websocket")
export class WebSocketController {
  constructor(private readonly webSocketService: WebSocketService) {}

  @Get("status")
  @ApiOperation({ summary: "Get WebSocket server status" })
  @ApiResponse({ status: 200, description: "WebSocket server status" })
  getStatus() {
    const connectedClients = this.webSocketService.getConnectedClients();

    return {
      status: "running",
      connectedClients: connectedClients.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("clients")
  @ApiOperation({ summary: "Get all connected WebSocket clients" })
  @ApiResponse({ status: 200, description: "List of connected clients" })
  getConnectedClients() {
    const clients = this.webSocketService.getConnectedClients();

    return {
      clients,
      count: clients.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("rooms/:room/clients")
  @ApiOperation({ summary: "Get clients in a specific room" })
  @ApiResponse({ status: 200, description: "List of clients in the room" })
  getClientsInRoom(@Param("room") room: string) {
    const clients = this.webSocketService.getClientsInRoom(room);

    return {
      room,
      clients,
      count: clients.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("rooms")
  @ApiOperation({ summary: "Get all active rooms" })
  @ApiResponse({ status: 200, description: "List of active rooms" })
  getActiveRooms() {
    const server = this.webSocketService.getServer();
    if (!server) {
      return {
        rooms: [],
        count: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const rooms = Array.from(server.sockets.adapter.rooms.keys());

    return {
      rooms,
      count: rooms.length,
      timestamp: new Date().toISOString(),
    };
  }
}
