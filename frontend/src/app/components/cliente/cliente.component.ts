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
  userStatuses: { [userId: string]: string } = {};
  userIdToCheck: string = '';
  userId: string = 'cliente';
  private marker?: maplibregl.Marker;
  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.socket.registerUser(this.userId);
    const map = new maplibregl.Map({
      container: 'map',
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [-35.271316, -5.911555], // Parnamirim, RN
      zoom: 15,
    });

    let coordenadas: [number, number][] = [];

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordenadas,
          },
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0000FF',
          'line-width': 4,
        },
      });
    });

    this.socket.getMessages().subscribe((data) => {
      this.messages.push(data);
      if (data.message.latitude && data.message.longitude) {
        console.log(
          `Coordenadas recebidas: Lat ${data.message.latitude.toFixed(
            6
          )}, Lng ${data.message.longitude.toFixed(6)}`
        );
        if (this.marker) {
          this.marker.remove();
        }
        const iconElement = document.createElement('div');
        iconElement.style.backgroundImage = 'url(assets/bus-icon.png)';
        iconElement.style.width = '32px';
        iconElement.style.height = '32px';
        iconElement.style.backgroundSize = 'contain';
        iconElement.style.backgroundRepeat = 'no-repeat';
        iconElement.style.backgroundPosition = 'center';

        this.marker = new maplibregl.Marker({ element: iconElement })
          .setLngLat([data.message.longitude, data.message.latitude])
          .addTo(map);

        // coordenadas.push([data.message.longitude, data.message.latitude]);
        // console.log('Coordenadas da rota:', coordenadas);

        // const routeSource = map.getSource('route') as maplibregl.GeoJSONSource;
        // routeSource?.setData({
        //   type: 'Feature',
        //   properties: {},
        //   geometry: {
        //     type: 'LineString',
        //     coordinates: coordenadas,
        //   },
        // });

        map.panTo([data.message.longitude, data.message.latitude]);
      }
    });

    this.socket.getUserOnline().subscribe((data) => {
      this.userStatuses[data.userId] = data.status;
      console.log(`Usuário ${data.userId} está ${data.status}`);
    });

    this.socket.getUserOffline().subscribe((data) => {
      this.userStatuses[data.userId] = data.status;
      console.log(`Usuário ${data.userId} está ${data.status}`);
    });
  }

  checkUserStatus() {
    if (this.userIdToCheck) {
      this.socket.checkUserStatus(this.userIdToCheck).subscribe((response) => {
        this.userStatuses[response.userId] = response.status;
        console.log(`Status do usuário ${response.userId}: ${response.status}`);
      });
    }
  }
}
