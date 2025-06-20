import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { WebSocketService } from "../../../../infrastructure/websocket/websocket.service";

@WebSocketGateway({
  namespace: "/users",
  cors: {
    origin: "*",
  },
})
export class UsersWebSocketGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(UsersWebSocketGateway.name);

  constructor(private readonly webSocketService: WebSocketService) {}

  @SubscribeMessage("user-status")
  handleUserStatus(
    @MessageBody()
    data: { userId: string; status: "online" | "offline" | "away" },
    @ConnectedSocket() client: Socket
  ) {
    const { userId, status } = data;
    this.logger.log(`User ${userId} status changed to: ${status}`);

    // Join user's personal room
    const userRoom = `user-${userId}`;
    client.join(userRoom);

    // Broadcast status change to user's room
    this.webSocketService.broadcastToRoom(userRoom, "user-status-updated", {
      userId,
      status,
      clientId: client.id,
    });

    // Also broadcast to general users room
    this.webSocketService.broadcastToRoom("users", "user-status-updated", {
      userId,
      status,
      clientId: client.id,
    });
  }

  @SubscribeMessage("join-user-room")
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { userId } = data;
    const userRoom = `user-${userId}`;

    client.join(userRoom);
    this.logger.log(`Client ${client.id} joined user room: ${userRoom}`);

    client.emit("user-room-joined", {
      userId,
      room: userRoom,
      message: `Joined user room: ${userRoom}`,
    });
  }

  @SubscribeMessage("user-message")
  handleUserMessage(
    @MessageBody()
    data: { userId: string; message: string; recipientId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const { userId, message, recipientId } = data;

    if (recipientId) {
      // Private message to specific user
      const recipientRoom = `user-${recipientId}`;
      this.webSocketService.broadcastToRoom(recipientRoom, "private-message", {
        fromUserId: userId,
        message,
        clientId: client.id,
      });

      // Also send back to sender for confirmation
      client.emit("message-sent", {
        toUserId: recipientId,
        message,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Broadcast to all users
      this.webSocketService.broadcastToRoom("users", "user-message", {
        fromUserId: userId,
        message,
        clientId: client.id,
      });
    }
  }

  @SubscribeMessage("user-typing")
  handleUserTyping(
    @MessageBody()
    data: { userId: string; isTyping: boolean; recipientId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const { userId, isTyping, recipientId } = data;

    if (recipientId) {
      // Private typing indicator
      const recipientRoom = `user-${recipientId}`;
      this.webSocketService.broadcastToRoom(recipientRoom, "user-typing", {
        fromUserId: userId,
        isTyping,
      });
    } else {
      // Global typing indicator
      this.webSocketService.broadcastToRoom("users", "user-typing", {
        fromUserId: userId,
        isTyping,
      });
    }
  }
}
