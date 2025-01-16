import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { LoginService } from './services/login.service';
import { StammtischService } from './services/stammtisch.service';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { JsonPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy{
  loginService = inject(LoginService);
  stammtischService = inject(StammtischService);
  
  ngOnInit(): void {
    // this.loginService.login('tester3@gmail.com', 'asdfasdf');
  }
  ngOnDestroy(): void {
    this.loginService.logout();
  }
}

