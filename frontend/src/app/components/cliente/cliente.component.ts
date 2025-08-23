import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

@Component({
  selector: 'app-cliente',
  imports: [],
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent {
  message!: string;
  messages: any[] = [];
  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;
  private map?: Map;

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.getMessages().subscribe((data) => {
      this.messages.push(data);
      if (data.message.latitude && data.message.longitude) {
        console.log('TESTE');
        this.addMarkerToMap(
          data.message.latitude,
          data.message.longitude,
          data.user
        );
        // Centraliza o mapa na nova localização (opcional)
        console.log(typeof data.message.longitude);
        console.log(typeof data.message.latitude);
        this.map?.panTo([data.message.longitude, data.message.latitude]);
      }
    });

    const map = new maplibregl.Map({
      container: 'map', // container id
      style: 'https://tiles.openfreemap.org/styles/liberty', // style URL
      center: [-46.633308, -23.55052], // starting position [lng, lat]
      zoom: 2, // starting zoom
    });
  }

  private initializeMap(): void {
    if (!this.mapContainer) {
      console.error('Contêiner do mapa não encontrado');
      return;
    }

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty', // Estilo OpenFreeMap
      center: [-46.633308, -23.55052], // [lng, lat] - São Paulo
      zoom: 10,
    });
  }

  private addMarkerToMap(lat: number, lng: number, user: string): void {
    if (!this.map) return;

    const marker = new maplibregl.Marker({
      color: '#FF0000', // Cor do marcador (ajuste se quiser)
    })
      .setLngLat([lng, lat])
      .setPopup(
        new maplibregl.Popup().setHTML(
          `<h3>Usuário: ${user}</h3><p>Lat: ${lat.toFixed(
            6
          )}</p><p>Lng: ${lng.toFixed(6)}</p>`
        )
      )
      .addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map?.remove(); // Remove o mapa para evitar memory leaks
  }
}
