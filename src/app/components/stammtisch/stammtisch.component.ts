import { Component, computed, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { StammtischService } from '../../services/stammtisch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stammtisch',
  imports: [],
  templateUrl: './stammtisch.component.html',
  styleUrl: './stammtisch.component.scss',
})
export class StammtischComponent implements OnInit {
  loginService = inject(LoginService);
  stammtischService = inject(StammtischService);
  router = inject(Router);

  nextStammtisch = this.stammtischService.nextStammtisch;
  isPersonParticipant = computed(() =>
    this.stammtischService.isPersonAlreadyParticipating(
      this.loginService.loggedInUser()
    )
  );
  ngOnInit(): void {}

  navigateTo() {
    this.router.navigateByUrl('home');
  }

  addParticipantToCurrentStammtisch() {
    this.stammtischService.addParticipantToCurrentStammtisch(
      this.loginService.loggedInUser()!
    );
  }

  removeParticipantFromStammtisch() {
    this.stammtischService.removeParticipantFromCurrentStammtisch(
      this.loginService.loggedInUser()
    );
  }
}
