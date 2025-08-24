import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      autoConnect: true,
    });
  }

  // Registra o userId ao conectar
  registerUser(userId: string) {
    this.socket.emit('register-user', userId);
  }

  // Envia localizações
  send(data: any) {
    this.socket.emit('emit', data);
  }

  // Recebe localizações
  getMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('emit', (data) => observer.next(data));
    });
  }

  // Recebe eventos de status online
  getUserOnline(): Observable<{ userId: string; status: string }> {
    return new Observable((observer) => {
      this.socket.on('user-online', (data) => observer.next(data));
    });
  }

  // Recebe eventos de status offline
  getUserOffline(): Observable<{ userId: string; status: string }> {
    return new Observable((observer) => {
      this.socket.on('user-offline', (data) => observer.next(data));
    });
  }

  // Verifica o status de um usuário
  checkUserStatus(
    userId: string
  ): Observable<{ userId: string; status: string }> {
    return new Observable((observer) => {
      this.socket.emit('check-user-status', userId);
      this.socket.once('user-status', (response) => observer.next(response));
    });
  }
}
