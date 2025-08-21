import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketComponent } from './components/socket/socket.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SocketComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'socket';
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      login: [''],
      senha: [''],
    });
  }

  entrar() {
    if (this.loginForm.valid) {
      const { login, senha } = this.loginForm.value;
      console.log('Login:', login, 'Senha:', senha);
    } else {
      console.log('Formulário inválido');
    }
  }
}
