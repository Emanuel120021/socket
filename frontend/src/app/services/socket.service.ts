import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('http://localhost:3000');

  send(message: any) {
    console.log(message);
    this.socket.emit('emit', message);
  }

  getMessages(): Observable<{ user: string; message: any }> {
    return new Observable<{ user: string; message: any }>((observer) => {
      this.socket.on('emit', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
