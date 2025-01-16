import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginService = inject(LoginService);
  router = inject(Router);

  email = signal('');
  password = signal('');

  constructor() {
    effect(() =>
      this.loginService.loggedInUser() !== undefined
        ? this.redirect()
        : console.log('not logged in')
    );
    this.loginService.resetMessage();
  }

  register() {
    this.loginService.createNewAccount(this.email(), this.password());
  }

  login() {
    this.loginService.resetMessage();
    this.loginService.login(this.email(), this.password());
  }

  redirect() {
    this.router.navigateByUrl('/home');
  }
}
