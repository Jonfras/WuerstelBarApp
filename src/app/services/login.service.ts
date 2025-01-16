import { effect, inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { PersonDto } from '../dtos/PersonDto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authService = inject(Auth);
  loggedInUser = signal<PersonDto|undefined>(undefined);
  errorMessage = signal<string>('');
  router = inject(Router);

  constructor(){
    effect(() => console.log(this.loggedInUser()));
    effect(() => {
      if (!this.loggedInUser()) {
        this.router.navigateByUrl('login');
      }
    })
  }

  login(email:string, password:string)  {
    try {
      signInWithEmailAndPassword(this.authService, email, password)
      .then((userCredential) => {
          const user: PersonDto = {
            email: userCredential.user.email!,
            id: userCredential.user.uid,
            name: null,
            region: null,
          }
          this.loggedInUser.set(user)
      }).catch((error) => {
        console.log(error);
        this.errorMessage.set(error)
      });

    } catch {
      console.log(`error logging in as: ${email}`);
    }
  }

  createNewAccount(email:string, password:string)  {
    try {
      console.log(`${email} ${password}`)
      createUserWithEmailAndPassword(this.authService, email, password)
      .then((userCredential) => {
        const user: PersonDto = {
          email: userCredential.user.email!,
            id: userCredential.user.uid,
            name: null,
            region: null,
        }
        this.loggedInUser.set(user)
      }).catch((error) => {
        console.log(error);
        this.errorMessage.set(error)
      });

    } catch {
      console.log(`error logging in as: ${email}`);
    }
  }

  logout() {
    console.log('logging out');
    signOut(this.authService);
    this.loggedInUser.set(undefined);
  }
}
