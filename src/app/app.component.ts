import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Task } from './task/task';
import { Lane } from './lane/lane';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { LaneComponent } from './lane/lane.component';
import { connectFirestoreEmulator, onSnapshot } from '@firebase/firestore';
import { LoginService } from './services/login.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  
}
