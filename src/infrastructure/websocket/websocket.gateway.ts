import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*", // Configure this properly for production
  },
  namespace: "/",
})
export class BaseWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BaseWebSocketGateway.name);

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send welcome message
    client.emit("welcome", {
      message: "Connected to NestJS WebSocket Gateway",
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("ping")
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.log(`Ping from client ${client.id}: ${JSON.stringify(data)}`);

    // Send pong response
    client.emit("pong", {
      message: "Pong!",
      timestamp: new Date().toISOString(),
      originalData: data,
    });
  }

  @SubscribeMessage("join-room")
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket
  ) {
    const { room } = data;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);

    client.emit("room-joined", {
      room,
      message: `Successfully joined room: ${room}`,
    });

    // Notify other clients in the room
    client.to(room).emit("user-joined", {
      clientId: client.id,
      room,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage("leave-room")
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket
  ) {
    const { room } = data;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);

    client.emit("room-left", {
      room,
      message: `Successfully left room: ${room}`,
    });

    // Notify other clients in the room
    client.to(room).emit("user-left", {
      clientId: client.id,
      room,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage("room-message")
  handleRoomMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket
  ) {
    const { room, message } = data;
    this.logger.log(`Room message from ${client.id} in ${room}: ${message}`);

    // Broadcast to all clients in the room (including sender)
    this.server.to(room).emit("room-message", {
      clientId: client.id,
      room,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Utility method to broadcast to all connected clients
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // Utility method to broadcast to a specific room
  broadcastToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
