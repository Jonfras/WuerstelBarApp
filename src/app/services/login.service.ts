import { effect, inject, Injectable, signal } from '@angular/core';
import { Auth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

interface User {
  id: string;
  email: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  authService = inject(Auth)
  user = signal<User | undefined>(undefined);
  errorMessage = signal<string>('');

  constructor() {
    effect(() => console.log(`new user logged in ${this.user()}`))
    // connectAuthEmulator(this.authService, 'http://127.0.0.1:31000')
  }

  login(email:string, password:string)  {
    try {
      console.log(`${email} ${password}`)

      signInWithEmailAndPassword(this.authService, email, password)
      .then((userCredential) => {
          const user: User = {
            email: userCredential.user.email,
            id: userCredential.user.uid
          }
          console.log(`user: ${user.email} ${user.id}`);
          this.user.set(user)
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
        const user: User = {
          email: userCredential.user.email,
          id: userCredential.user.uid
        }
        console.log(`user: ${user.email} ${user.id}`);
        this.user.set(user)
      }).catch((error) => {
        console.log(error);
        this.errorMessage.set(error)
      });

    } catch {
      console.log(`error logging in as: ${email}`);
    }
  }

  logout() {
    signOut(this.authService);
  }
}
