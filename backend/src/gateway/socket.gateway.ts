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

  handleConnection(client: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('emit')
  handleMessage(client: any, message: string) {
    console.log('Message received:', message);
    this.server.emit('emit', { user: 'Server', message });
  }
}
