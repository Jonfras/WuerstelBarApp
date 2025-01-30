import {Component, effect, inject, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    this.loginService.autoLogin();
  }

  login() {
    this.loginService.resetMessage();
    this.loginService.login(this.email(), this.password());
  }

  redirect() {
    this.router.navigateByUrl('/home');
  }
}
