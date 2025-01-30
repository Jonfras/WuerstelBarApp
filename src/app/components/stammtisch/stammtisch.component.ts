import {Component, computed, effect, inject, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {StammtischService} from '../../services/stammtisch.service';
import {Router} from '@angular/router';
import {PersonDto} from "../../dtos/PersonDto";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-stammtisch',
  imports: [
    FormsModule
  ],
  templateUrl: './stammtisch.component.html',
  styleUrl: './stammtisch.component.scss',
  standalone: true
})
export class StammtischComponent implements OnInit {
  loginService = inject(LoginService);
  stammtischService = inject(StammtischService);
  router = inject(Router);
  manualMode = false;

  allowManualMode = computed(() => {
    //only allow if you are a driver
    console.log(this.nextStammtisch()?.drivers);
    console.log(this.loginService.loggedInUser())
    console.log(this.nextStammtisch()?.drivers.find((driver) => driver.id === this.loginService.loggedInUser()?.id) !== undefined);
    return this.nextStammtisch()?.drivers.find((driver) => driver.id === this.loginService.loggedInUser()?.id) !== undefined;
  });

  tableParticipants: { person: PersonDto, isDriver: boolean }[] = [];

  nextStammtisch = this.stammtischService.nextStammtisch;
  isPersonParticipant = computed(() =>
    this.stammtischService.isPersonAlreadyParticipating(
      this.loginService.loggedInUser()
    )
  );

  _ = effect(() => {
    this.tableParticipants = [];
    const drivers = this.nextStammtisch()?.drivers;
    this.nextStammtisch()?.participants.forEach((participant) => {
      this.tableParticipants.push({
        person: participant.person,
        isDriver: drivers?.some((driver) => driver.id === participant.person.id) ?? false,
      });
    });
  });

  ngOnInit(): void {
  }

  navigateTo() {
    this.router.navigateByUrl('home');
  }

  setDriver() {
    const drivers = this.tableParticipants.filter((participant) => participant.isDriver).map((participant) => participant.person);
    if (drivers.length > 0) {
      this.stammtischService.setDriversManually(drivers);
      this.manualMode = false;
    } else {
      alert('Please select at least one driver');
    }
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
