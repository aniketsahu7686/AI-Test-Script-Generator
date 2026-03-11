import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TestCase } from '../../models/models';

@Component({
  selector: 'app-test-case-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <div class="table-container mat-elevation-z2">
      <table mat-table [dataSource]="testCases">

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Test Case ID</th>
          <td mat-cell *matCellDef="let tc" class="id-cell">{{ tc.testCaseId }}</td>
        </ng-container>

        <ng-container matColumnDef="scenario">
          <th mat-header-cell *matHeaderCellDef>Scenario</th>
          <td mat-cell *matCellDef="let tc">{{ tc.scenario }}</td>
        </ng-container>

        <ng-container matColumnDef="steps">
          <th mat-header-cell *matHeaderCellDef>Steps</th>
          <td mat-cell *matCellDef="let tc" class="steps-cell">{{ tc.steps }}</td>
        </ng-container>

        <ng-container matColumnDef="expectedResult">
          <th mat-header-cell *matHeaderCellDef>Expected Result</th>
          <td mat-cell *matCellDef="let tc">{{ tc.expectedResult }}</td>
        </ng-container>

        <ng-container matColumnDef="testType">
          <th mat-header-cell *matHeaderCellDef>Test Type</th>
          <td mat-cell *matCellDef="let tc">
            <span class="badge" [ngClass]="getTypeBadge(tc.testType)">{{ tc.testType }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let tc">
            <span class="badge" [ngClass]="getStatusBadge(tc.executionStatus)">{{ tc.executionStatus }}</span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid #334155;
    }

    table {
      width: 100%;
    }

    .id-cell {
      font-family: monospace;
      font-weight: 600;
      color: #6366f1 !important;
      white-space: nowrap;
    }

    .steps-cell {
      white-space: pre-line;
      max-width: 300px;
    }
  `]
})
export class TestCaseTableComponent implements OnChanges {
  @Input() testCases: TestCase[] = [];
  @Input() showStatus = false;

  displayedColumns: string[] = ['id', 'scenario', 'steps', 'expectedResult', 'testType'];

  ngOnChanges() {
    this.displayedColumns = this.showStatus
      ? ['id', 'scenario', 'steps', 'expectedResult', 'testType', 'status']
      : ['id', 'scenario', 'steps', 'expectedResult', 'testType'];
  }

  getTypeBadge(type: string): string {
    switch (type?.toLowerCase()) {
      case 'positive': return 'badge-positive';
      case 'negative': return 'badge-negative';
      case 'edge': case 'edge case': return 'badge-edge';
      default: return 'badge-positive';
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'PASS': return 'badge-pass';
      case 'FAIL': return 'badge-fail';
      default: return 'badge-not-executed';
    }
  }
}
