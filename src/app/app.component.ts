import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginService } from './services/login.service';
import { StammtischService } from './services/stammtisch.service';
import { Title } from '@angular/platform-browser';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { JsonPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  loginService = inject(LoginService);
  stammtischService = inject(StammtischService);
  titleService = inject(Title);
  titles: string[] = [
    'Lecker Bierchen',
    'Geil saufen',
    'Endlich Mittwoch',
    'Skibidi Toilet',
    '10 Bier Dienstag',
    'Biiiier',
    'Würstelbar',
    'H&H',
    'Heitzinger Hans',
    'Leck Eier',
    'That feeling when tomorrow is knee surgery',
    'Buy a property in egypt',
    '🍺🍺🍺🍺🍺🍺🍺🍺',
    'Wer das liest ist dumm'
  ];

  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * this.titles.length);
    const randomTitle = this.titles[randomIndex];
    this.titleService.setTitle(randomTitle);
    // this.loginService.login('foo@bar.com', 'foobar');
  }
  ngOnDestroy(): void {
    this.loginService.logout();
  }
}
