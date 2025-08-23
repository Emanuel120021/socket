import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-socket',
  imports: [FormsModule],
  providers: [SocketService],
  standalone: true,
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.scss',
})
export class SocketComponent {
  message!: string;
  messages: { user: string; message: string }[] = [];

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.getMessages().subscribe((data) => {
      this.messages.push(data);
    });
  }

  send() {
    if (this.message) {
      this.socket.send(this.message);
      this.message = '';
    }
  }
}
