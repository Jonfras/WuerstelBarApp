import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OkStatus, ValuesService } from '../../swagger';
import { NgSignalDirective } from '../../shared/ngSignal.directive';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, NgSignalDirective, MatButtonModule],
  templateUrl: './test-general.component.html',
  styleUrl: './test-general.component.scss'
})
export class TestPageComponent implements OnInit {
  private valuesService = inject(ValuesService);
  linqAverage = 0;
  linqAverageExpected = 2.5;
  myStr = signal('abc');
  okStatus: OkStatus = { isOk: false, error: '', nr: -2 };
  // okStatus: OkStatus = { isOk: true, error: '', nr: 1 };

  ngOnInit(): void {
    this.linqAverage = [1, 2, 3, 4].average(); //testing linq
    this.valuesService.valuesProductsGet().subscribe(
      {
        next: x => this.okStatus = x,
        error: err => this.okStatus.error = err.message,
      });
  }
}
