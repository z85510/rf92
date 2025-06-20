import { Injectable } from "@nestjs/common";
import { BaseWebSocketGateway } from "./websocket.gateway";

@Injectable()
export class WebSocketService {
  constructor(private readonly webSocketGateway: BaseWebSocketGateway) {}

  /**
   * Broadcast a message to all connected clients
   */
  broadcastToAll(event: string, data: any) {
    this.webSocketGateway.broadcastToAll(event, data);
  }

  /**
   * Broadcast a message to a specific room
   */
  broadcastToRoom(room: string, event: string, data: any) {
    this.webSocketGateway.broadcastToRoom(room, event, data);
  }

  /**
   * Get the WebSocket server instance
   */
  getServer() {
    return this.webSocketGateway.server;
  }

  /**
   * Get all connected socket IDs
   */
  getConnectedClients(): string[] {
    const server = this.getServer();
    if (!server) return [];

    return Array.from(server.sockets.sockets.keys());
  }

  /**
   * Get clients in a specific room
   */
  getClientsInRoom(room: string): string[] {
    const server = this.getServer();
    if (!server) return [];

    const roomSockets = server.sockets.adapter.rooms.get(room);
    return roomSockets ? Array.from(roomSockets) : [];
  }

  /**
   * Check if a client is in a specific room
   */
  isClientInRoom(clientId: string, room: string): boolean {
    return this.getClientsInRoom(room).includes(clientId);
  }

  /**
   * Disconnect a specific client
   */
  disconnectClient(clientId: string) {
    const server = this.getServer();
    if (!server) return;

    const socket = server.sockets.sockets.get(clientId);
    if (socket) {
      socket.disconnect();
    }
  }

  /**
   * Send a message to a specific client
   */
  sendToClient(clientId: string, event: string, data: any) {
    const server = this.getServer();
    if (!server) return;

    const socket = server.sockets.sockets.get(clientId);
    if (socket) {
      socket.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
