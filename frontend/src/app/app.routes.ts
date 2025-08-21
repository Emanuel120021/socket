import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { LoginComponent } from './components/login/login.component';
import { ServidorComponent } from './components/servidor/servidor.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'servidor', component: ServidorComponent },
];
