import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servidor',
  standalone: true,
  imports: [FormsModule],
  providers: [SocketService],
  templateUrl: './servidor.component.html',
  styleUrl: './servidor.component.scss',
})
export class ServidorComponent implements OnInit, OnDestroy {
  message!: string;
  messages: { user: string; message: string }[] = [];

  latitude?: number;
  longitude?: number;
  error?: string;

  private intervalId?: any;

  constructor(private socket: SocketService) {}

  ngOnInit(): void {
    if ('geolocation' in navigator) {
      // pega a primeira vez
      this.updateLocation();

      // repete a cada 10s
      this.intervalId = setInterval(() => {
        this.updateLocation();
        this.sendLocation();
      }, 10000);
    } else {
      this.error = 'Geolocalização não suportada neste navegador';
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      },
      (err) => {
        this.error = err.message;
      }
    );
  }

  sendLocation() {
    if (this.latitude && this.longitude) {
      const payload = {
        user: 'meu-usuario', // você pode trocar pelo ID do usuário logado
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.socket.sendMessage(payload);
    }
  }
}
