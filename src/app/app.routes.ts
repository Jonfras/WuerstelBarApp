import { Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: 'board' , component: BoardComponent},
    {path: 'login' , component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
 ];
