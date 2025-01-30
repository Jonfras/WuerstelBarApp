import {effect, inject, Injectable, signal} from '@angular/core';
import {Auth, signInWithCustomToken, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {PersonDto} from '../dtos/PersonDto';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authService = inject(Auth);
  loggedInUser = signal<PersonDto | undefined>(undefined);
  errorMessage = signal<string>('');
  router = inject(Router);

  credentials = '';

  constructor() {
    effect(() => console.log(this.loggedInUser()));
    effect(() => {
      if (!this.loggedInUser()) {
        this.router.navigateByUrl('login');
      }
    });
  }

  resetMessage() {
    this.errorMessage.set('');
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.authService, email, password)
      .then((userCredential) => {
        this.loggedInUser.set(this.createPersonDto(userCredential));
        localStorage.setItem('credentials', JSON.stringify({email, password, lastLogin: new Date()}));
      })
      .catch((error) => {
        console.log(error);
        this.errorMessage.set(error)
      });
  }

  autoLogin() {
    const credentials = localStorage.getItem('credentials');
    if (credentials && new Date(JSON.parse(credentials).lastLogin).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24) {
      const {email, password} = JSON.parse(credentials);
      this.login(email, password);
    }
  }

  logout() {
    console.log('logging out');
    signOut(this.authService);
    this.loggedInUser.set(undefined);
  }

  createPersonDto(credentials: any): PersonDto {
    return {
      email: credentials.user.email,
      id: credentials.user.uid,
      name: null,
      region: null,
    };
  }
}
