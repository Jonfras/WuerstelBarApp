import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy{
  loginService = inject(LoginService);
  router = inject(Router);

  password = signal<string>('');
  email = signal<string>('');
  errorMessage = computed(() => this.loginService.errorMessage());

  constructor() {
    effect(() => this.loginService.user() !== undefined ? this.redirect() : console.log('not logged in'));
    effect(() => this.errorMessage() ? alert(this.errorMessage()): undefined)
  }
  ngOnDestroy(): void {
    this.loginService.logout();
  }

  login() {
    this.loginService.login(this.email(),this.password());
  }
  register() {
    this.loginService.createNewAccount(this.email(), this.password());
  }
  redirect() {
    this.router.navigateByUrl('/board');
  }
  
}

