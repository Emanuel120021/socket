import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  title = 'socket';
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: Router) {
    this.loginForm = this.fb.group({
      login: [''],
      senha: [''],
    });
  }

  entrar() {
    if (this.loginForm.valid) {
      const { login, senha } = this.loginForm.value;

      if (login == 'cliente' && senha == '123456') {
        this.route.navigate(['/cliente']);
        return;
      }
      if (login == 'servidor' && senha == '123456') {
        this.route.navigate(['/servidor']);
        return;
      }
    } else {
      console.log('Formulário inválido');
    }
  }
}
