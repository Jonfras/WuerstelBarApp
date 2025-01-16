import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { StammtischService } from '../../services/stammtisch.service';
import { LoginService } from '../../services/login.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [JsonPipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  stammtischService = inject(StammtischService);
  loginService = inject(LoginService);
  router = inject(Router);

  constructor() {
    // effect(() => console.log())
  }

  isStammtischExpanded = signal(false);

  ngOnInit(): void {}

  createEvent() {
    this.stammtischService.createStammtisch();
  }

  toggleStammtischExpansion() {
    const isAlreadyParticipating =
      this.stammtischService.isPersonAlreadyParticipating(
        this.loginService.loggedInUser()
      );

    this.isStammtischExpanded.update((previous) => !previous);
  }

  addParticipantToStammtisch() {
    this.navigateTo('naechsterStammtisch');
  }

  navigateTo(uri: string) {
    console.log('redirecting');
    this.router.navigateByUrl(uri);
  }

  logout() {
    this.loginService.logout();
    this.navigateTo('login');
  }
}
