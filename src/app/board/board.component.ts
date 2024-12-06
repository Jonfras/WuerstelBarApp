import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { connectFirestoreEmulator, onSnapshot } from '@firebase/firestore';
import { LoginService } from '../services/login.service';
import { Lane } from '../lane/lane';
import { Task } from '../task/task';
import { LaneComponent } from '../lane/lane.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, LaneComponent, AngularFireModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnDestroy, OnInit{
  firestore = inject(Firestore);
  loginService = inject(LoginService)
  router = inject(Router)
  tasks = signal<Task[]>([]);
  lanes = signal<Lane[]>([]);
  currentLane = signal<Lane | undefined>(undefined);
  draggedElement = signal<Task | undefined>(undefined);
  unsubscribe: any;
  lastEditedBy = signal<string>('');

  constructor() {
  }

  ngOnInit(): void {
    // if (window.location.hostname === 'localhost') {
    //   connectFirestoreEmulator(this.firestore, '127.0.0.1', 8080);
    // }
    if(this.loginService.user() == undefined) {
      this.router.navigateByUrl('/login');
    }

    this.tasks.set([
      { id: '1', title: 'Task 1', description: 'Description for Task 1' },
      { id: '2', title: 'Task 2', description: 'Description for Task 2' },
      { id: '3', title: 'Task 3', description: 'Description for Task 3' },
      { id: '4', title: 'Task 4', description: 'Description for Task 4' },
      { id: '5', title: 'Task 5', description: 'Description for Task 5' },
    ]);

    this.lanes.set([
      { id: 0, title: 'Lane 1', tasks: [this.tasks()[0], this.tasks()[1]] },
      { id: 1, title: 'Lane 2', tasks: [this.tasks()[2], this.tasks()[3]] },
      { id: 2, title: 'Lane 3', tasks: [this.tasks()[4]] },
    ]);
    this.writeDatabase();

    // this.authService.createNewAccount('a@asdf.com', '123456');
    


    this.unsubscribe = onSnapshot(
      doc(this.firestore, 'kanbanFire/lanes'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          this.lanes.set(data['lanes']);
          this.lastEditedBy.set(data['lastEditedBy']);
        } else {
          console.warn('Document does not exist');
        }
      }
    );   
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    this.loginService.logout();
  }

  taskEdited(editedTask: Task) {
    console.log(editedTask);
  }

  overLane(lane: Lane) {
    this.currentLane.set(lane);
  }

  resetLane() {
    this.currentLane.set(undefined);
  }

  drop() {
    if (this.currentLane() === undefined) return;
    if (this.draggedElement() === undefined) return;
    this.lanes.update((oldValues) => {
      let laneToEdit = oldValues
        .where((lane) => lane.id === this.currentLane()?.id)
        .first();
      oldValues.forEach((lane) => {
        lane.tasks = lane.tasks.filter(
          (task) => task.id !== this.draggedElement()?.id
        );
      });
      oldValues[laneToEdit.id].tasks.push(this.draggedElement()!);
      return oldValues;
    });

    this.writeDatabase();
    this.draggedElement.set(undefined);
  }

  writeDatabase() {
    const docRef = doc(this.firestore, 'kanbanFire/lanes');
    return updateDoc(docRef, { lanes: this.lanes() , lastEditedBy: this.loginService.user()?.email ?? ''});
  }
}
