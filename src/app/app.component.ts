import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Task } from './task/task';
import { Lane } from './lane/lane';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { LaneComponent } from './lane/lane.component';
import { onSnapshot } from '@firebase/firestore';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, LaneComponent, AngularFireModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  firestore = inject(Firestore);
  tasks = signal<Task[]>([]);
  lanes = signal<Lane[]>([]);
  currentLane = signal<Lane | undefined>(undefined);
  draggedElement = signal<Task | undefined>(undefined);
  unsubscribe: any;

  ngOnInit(): void {
    this.unsubscribe = onSnapshot(
      doc(this.firestore, 'kanbanFire/lanes'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          this.lanes.set(data['lanes']);
        } else {
          console.warn('Document does not exist');
        }
      }
    );

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

  ngOnDestroy(): void {
    this.unsubscribe();
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
    return updateDoc(docRef, { lanes: this.lanes() });
  }
}
