import { Routes } from '@angular/router';
import { StammtischComponent } from './components/stammtisch/stammtisch.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'naechsterStammtisch', component: StammtischComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'/login', pathMatch:'full'},
];
