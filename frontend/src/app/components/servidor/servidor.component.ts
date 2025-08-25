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
  direction: number = 0;
  currentLatitude?: number; // Persiste a latitude atual
  currentLongitude?: number; // Persiste a longitude atual
  speed?: number; // Velocidade do ônibus
  lastUpdate?: number; // Última atualização

  private intervalId?: any;

  constructor(private socket: SocketService) {}

  ngOnInit(): void {
    // Registra o usuário ao conectar
    this.socket.registerUser(this.userId);

    if ('geolocation' in navigator) {
      // Obtém a localização inicial
      this.updateLocation();
      // this.simulateBusLocation();

      // Atualiza a localização a cada 5 segundos
      this.intervalId = setInterval(() => {
        this.updateLocation();
        // this.simulateBusLocation();
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

  private simulateBusLocation() {
    // Initialize base coordinates and state (persist across calls)
    if (
      this.currentLatitude === undefined ||
      this.currentLongitude === undefined ||
      this.speed === undefined ||
      this.lastUpdate === undefined
    ) {
      this.currentLatitude = -5.915; // Ponto inicial em Parnamirim
      this.currentLongitude = -35.262;
      this.direction = 45; // Direção em graus (ex.: 45° para nordeste)
      this.speed = 8.33; // Velocidade em metros/segundo (30 km/h)
      this.lastUpdate = Date.now();
    }

    try {
      // Calcula o tempo desde a última atualização (em segundos)
      const currentTime = Date.now();
      const timeDelta = (currentTime - this.lastUpdate) / 1000; // Tempo em segundos
      this.lastUpdate = currentTime;

      // Raio da Terra em metros
      const earthRadius = 6371000;

      // Distância percorrida (velocidade * tempo)
      const distance = this.speed * timeDelta;

      // Converte a direção para radianos
      const radDirection = (this.direction * Math.PI) / 180;

      // Calcula os deslocamentos de latitude e longitude
      const latOffset =
        ((distance * Math.cos(radDirection)) / earthRadius) * (180 / Math.PI);
      const lonOffset =
        (((distance * Math.sin(radDirection)) / earthRadius) *
          (180 / Math.PI)) /
        Math.cos((this.currentLatitude * Math.PI) / 180);

      // Atualiza as coordenadas
      this.currentLatitude += latOffset;
      this.currentLongitude += lonOffset;

      // Armazena nas propriedades originais de latitude/longitude para compatibilidade
      this.latitude = this.currentLatitude;
      this.longitude = this.currentLongitude;
      this.error = undefined;

      // Simula a precisão do GPS (5-20 metros)
      const simulatedAccuracy = 5 + Math.random() * 15;

      // Adiciona uma pequena variação aleatória na direção para simular curvas (ex.: ±5 graus)
      this.direction += (Math.random() - 0.5) * 10;

      console.log(
        `Coordenadas simuladas (Parnamirim): Lat ${this.latitude.toFixed(
          6
        )}, Lng ${this.longitude.toFixed(
          6
        )}, Precisão: ${simulatedAccuracy.toFixed(
          1
        )}m, Direção: ${this.direction.toFixed(1)}°`
      );
    } catch (err: unknown) {
      // Trata o erro de forma segura
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      this.error = `Erro ao simular geolocalização: ${errorMessage}`;
      console.error(this.error);
    }
  }

  sendLocation() {
    if (this.latitude !== undefined && this.longitude !== undefined) {
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
