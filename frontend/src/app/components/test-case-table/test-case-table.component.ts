import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase } from '../../models/models';

@Component({
  selector: 'app-test-case-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Scenario</th>
            <th>Steps</th>
            <th>Expected Result</th>
            <th>Type</th>
            <th *ngIf="showStatus">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tc of testCases">
            <td class="id-cell">{{ tc.testCaseId }}</td>
            <td>{{ tc.scenario }}</td>
            <td class="steps-cell">{{ tc.steps }}</td>
            <td>{{ tc.expectedResult }}</td>
            <td>
              <span class="badge" [ngClass]="getTypeBadge(tc.testType)">
                {{ tc.testType }}
              </span>
            </td>
            <td *ngIf="showStatus">
              <span class="badge" [ngClass]="getStatusBadge(tc.executionStatus)">
                {{ tc.executionStatus }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid #334155;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th {
      background: #334155;
      color: #e2e8f0;
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      white-space: nowrap;
    }

    .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #334155;
      color: #cbd5e1;
      vertical-align: top;
    }

    .data-table tbody tr:hover {
      background: rgba(99, 102, 241, 0.05);
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

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge-positive { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge-negative { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .badge-edge { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .badge-pass { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge-fail { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .badge-not-executed { background: rgba(100, 116, 139, 0.15); color: #94a3b8; }
  `]
})
export class TestCaseTableComponent {
  @Input() testCases: TestCase[] = [];
  @Input() showStatus = false;

  getTypeBadge(type: string): string {
    switch (type?.toLowerCase()) {
      case 'positive': return 'badge-positive';
      case 'negative': return 'badge-negative';
      case 'edge case': return 'badge-edge';
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
