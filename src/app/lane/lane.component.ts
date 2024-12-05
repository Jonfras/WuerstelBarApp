import { Component, input, model, output, signal } from '@angular/core';
import { Task } from '../task/task';
import { Lane } from './lane';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-lane',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './lane.component.html',
  styleUrl: './lane.component.scss',
})
export class LaneComponent {
  tasks = model<Task[]>([]);
  title = input.required<string>();
  draggedElement = model<Task | undefined>(undefined);
  lane = input.required<Lane>();

  startDragging(task: Task) {
    this.draggedElement.set(task);
  }
}
