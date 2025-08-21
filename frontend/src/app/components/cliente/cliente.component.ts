import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-cliente',
  imports: [],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent {
  message!: string;
  messages: { user: string; message: string }[] = [];

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.getMessages().subscribe((data) => {
      this.messages.push(data);
    });

    console.log(this.messages);
  }
}
