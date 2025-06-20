import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  namespace: '/templates',
  cors: {
    origin: '*',
  },
})
export class TemplateWebSocketGateway {
  @WebSocketServer()
  server: Server;

  notifyTemplateCreated(templateId: string, tenantId: string): void {
    this.server.to(`tenant:${tenantId}`).emit('template:created', {
      templateId,
      timestamp: new Date().toISOString(),
    });
  }

  notifyTemplateUpdated(templateId: string, tenantId: string): void {
    this.server.to(`tenant:${tenantId}`).emit('template:updated', {
      templateId,
      timestamp: new Date().toISOString(),
    });
  }

  notifyTemplateDeleted(templateId: string, tenantId: string): void {
    this.server.to(`tenant:${tenantId}`).emit('template:deleted', {
      templateId,
      timestamp: new Date().toISOString(),
    });
  }
}