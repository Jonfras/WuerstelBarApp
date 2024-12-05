import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Task } from './task/task';
import { Lane } from './lane/lane';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule} from '@angular/fire/compat'

import { environment } from '../environments/environment';
import { initializeApp } from '@angular/fire/app';
import { LaneComponent } from './lane/lane.component';
import { appConfig } from './app.config';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, LaneComponent, AngularFireModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  tasks = signal<Task[]>([]);
  lanes = signal<Lane[]>([]);
  currentLane = signal<Lane | undefined>(undefined);
  draggedElement = signal<Task | undefined>(undefined);

  ngOnInit(): void {
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
  }

  constructor() {
    effect(() => console.log(this.tasks()));
    effect(() => console.log(`appComponent: ${this.draggedElement()?.title}`));
  }

  taskEdited(editedTask: Task) {
    console.log(editedTask);
  }

  overLane(lane: Lane) {
    console.log(`lane over: ${lane.title}`);
    this.currentLane.set(lane);
  }

  resetLane() {
    console.log(`resetLane`);
    this.currentLane.set(undefined);
  }
  startDragging() {}

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
    this.draggedElement.set(undefined);
  }
}
