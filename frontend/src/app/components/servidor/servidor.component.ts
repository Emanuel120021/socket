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

  latitude: number = -23.55052; // Ponto inicial (exemplo: São Paulo, Brasil)
  longitude: number = -46.633308;
  error?: string;

  private intervalId?: any;
  private speed: number = 0.0001; // Velocidade base do movimento (em graus)
  private direction: number = Math.random() * 2 * Math.PI; // Direção inicial aleatória (em radianos)

  constructor(private socket: SocketService) {}

  ngOnInit(): void {
    // Inicia a simulação de localização
    this.updateLocation();

    // Atualiza a localização a cada 5 segundos
    this.intervalId = setInterval(() => {
      this.updateLocation();
      this.sendLocation();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateLocation() {
    // Adiciona uma pequena variação aleatória na direção
    this.direction += (Math.random() - 0.5) * 0.2; // Variação de ±0.1 radiano

    // Calcula o deslocamento em latitude e longitude com base na direção
    const deltaLat = this.speed * Math.cos(this.direction);
    const deltaLon = this.speed * Math.sin(this.direction);

    // Atualiza as coordenadas
    this.latitude += deltaLat;
    this.longitude += deltaLon;

    // Adiciona um pequeno ruído aleatório para simular imperfeições no movimento
    this.latitude += (Math.random() - 0.5) * 0.00002;
    this.longitude += (Math.random() - 0.5) * 0.00002;

    // Limita as coordenadas para evitar valores fora de intervalos válidos
    this.latitude = Math.max(-90, Math.min(90, this.latitude));
    this.longitude = Math.max(-180, Math.min(180, this.longitude));
  }

  sendLocation() {
    if (this.latitude && this.longitude) {
      const payload = {
        user: 'meu-usuario', // Pode ser substituído pelo ID do usuário logado
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.socket.send(payload);
    }
  }
}
