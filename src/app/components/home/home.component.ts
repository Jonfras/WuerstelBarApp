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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../constants/custom-date-formats';
import { FormControl } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {StammtischDto} from "../../dtos/StammtischDto";
import {PersonDto} from "../../dtos/PersonDto";

@Component({
  selector: 'app-home',
  imports: [
    JsonPipe,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatButton,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-AT' },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  stammtischService = inject(StammtischService);
  loginService = inject(LoginService);
  router = inject(Router);
  selectedDate = signal<Date>(new Date());
  readonly date = new FormControl(this.stammtischService.nextWednesday());

  constructor() {
    effect(() => console.log(this.selectedDate()));
  }


  ngOnInit(): void {
    this.dateChanged(this.stammtischService.nextWednesday());
  }

  createEvent() {
    this.stammtischService.createStammtisch(this.selectedDate());
  }

  dateChanged(date: Date) {
    this.selectedDate.set(date);
  }

  addParticipantToStammtisch() {
    this.navigateTo('naechsterStammtisch');
  }

  navigateTo(uri: string) {
    this.router.navigateByUrl(uri);
  }

  convertToDate(date: Date) {
    return new Date(date);
  }

  isDiver(stammtisch: StammtischDto, driver: PersonDto) {
    return stammtisch.drivers.some(x => x.id === driver.id);
  }

  logout() {
    this.loginService.logout();
    this.navigateTo('login');
  }
}
