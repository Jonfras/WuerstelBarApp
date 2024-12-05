import { Component, input, output } from '@angular/core';
import { Task } from './task';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  task = input.required<Task>();
  edit = output<Task>();
  taskDragged = output<Task>();
  taskDropped = output<Task>();

  dragged(task: Task) {
    console.log(`task --> dragged: ${task.title}`)
    this.taskDragged.emit(task)
  }
}
