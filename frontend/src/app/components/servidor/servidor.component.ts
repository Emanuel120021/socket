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
  userId: string = 'servidor'; // Substitua por ID dinâmico, se aplicável

  private intervalId?: any;

  constructor(private socket: SocketService) {}

  ngOnInit(): void {
    // Registra o usuário ao conectar
    this.socket.registerUser(this.userId);

    if ('geolocation' in navigator) {
      // Obtém a localização inicial
      this.updateLocation();

      // Atualiza a localização a cada 5 segundos
      this.intervalId = setInterval(() => {
        this.updateLocation();
        this.sendLocation();
      }, 5000);
    } else {
      this.error = 'Geolocalização não suportada neste navegador';
      console.error(this.error);
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
        this.error = undefined;
        console.log(
          `Coordenadas obtidas: Lat ${this.latitude.toFixed(
            6
          )}, Lng ${this.longitude.toFixed(6)}, Precisão: ${
            position.coords.accuracy
          }m`
        );
      },
      (err) => {
        this.error = `Erro ao obter geolocalização: ${err.message} (Código: ${err.code})`;
        console.error(this.error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  sendLocation() {
    if (this.latitude && this.longitude) {
      const payload = {
        user: this.userId,
        message: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      };
      this.socket.send(payload);
      console.log('Localização enviada:', payload);
    } else {
      console.warn('Coordenadas não disponíveis para envio');
    }
  }
}
