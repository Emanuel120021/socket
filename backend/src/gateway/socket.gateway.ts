/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  // Mapa para rastrear usuários conectados (userId -> socketId)
  private onlineUsers = new Map<string, string>();

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
    let disconnectedUserId: string | null = null;
    // Remove o usuário do mapa de usuários online
    for (const [userId, socketId] of this.onlineUsers) {
      if (socketId === client.id) {
        disconnectedUserId = userId;
        this.onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      this.server.emit('user-offline', {
        userId: disconnectedUserId,
        status: 'offline',
      });
      console.log(`Usuário ${disconnectedUserId} está offline`);
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(client: any, userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.onlineUsers.set(userId, client.id);
    console.log(`Usuário ${userId} registrado como online`);
    this.server.emit('user-online', { userId, status: 'online' });
  }

  @SubscribeMessage('emit')
  handleMessage(
    client: any,
    payload: { user: string; message: { latitude: number; longitude: number } },
  ) {
    console.log('Localização recebida:', payload);
    this.server.emit('emit', payload); // Retransmite para todos os clientes
  }

  @SubscribeMessage('check-user-status')
  handleCheckUserStatus(client: any, userId: string) {
    const isOnline = this.onlineUsers.has(userId);
    client.emit('user-status', {
      userId,
      status: isOnline ? 'online' : 'offline',
    });
    console.log(
      `Status do usuário ${userId}: ${isOnline ? 'online' : 'offline'}`,
    );
  }
}
