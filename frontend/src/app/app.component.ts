import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SocketComponent } from './components/socket/socket.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'socket';
  loginForm!: FormGroup;

  constructor() {}
}
