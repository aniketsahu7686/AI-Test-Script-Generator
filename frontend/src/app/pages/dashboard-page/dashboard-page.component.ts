import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DashboardResponse, DashboardStats, TestCase } from '../../models/models';
import { StatsCardsComponent } from '../../components/stats-cards/stats-cards.component';
import { TestCaseTableComponent } from '../../components/test-case-table/test-case-table.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, StatsCardsComponent, TestCaseTableComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1><i class="fas fa-chart-bar"></i> Dashboard</h1>
        <p>Overview of test execution results</p>
        <button class="btn btn-outline refresh-btn" (click)="loadDashboard()">
          <i class="fas fa-sync-alt" [class.fa-spin]="loading"></i> Refresh
        </button>
      </div>

      <!-- Stats Cards -->
      <app-stats-cards [stats]="stats"></app-stats-cards>

      <!-- Progress Bar -->
      <div *ngIf="stats.totalTests > 0" class="card progress-card">
        <h3>Execution Progress</h3>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-segment pass" [style.width.%]="passPercent"></div>
            <div class="progress-segment fail" [style.width.%]="failPercent"></div>
            <div class="progress-segment pending" [style.width.%]="pendingPercent"></div>
          </div>
          <div class="progress-legend">
            <span class="legend-item"><span class="dot pass"></span> Pass {{ passPercent | number:'1.0-0' }}%</span>
            <span class="legend-item"><span class="dot fail"></span> Fail {{ failPercent | number:'1.0-0' }}%</span>
            <span class="legend-item"><span class="dot pending"></span> Not Executed {{ pendingPercent | number:'1.0-0' }}%</span>
          </div>
        </div>
      </div>

      <!-- Test Cases Table -->
      <div *ngIf="testCases.length > 0" class="results-section">
        <h2><i class="fas fa-table"></i> Test Case Results</h2>
        <app-test-case-table [testCases]="testCases" [showStatus]="true"></app-test-case-table>
      </div>

      <!-- Empty State -->
      <div *ngIf="testCases.length === 0 && !loading" class="empty-state">
        <i class="fas fa-chart-pie"></i>
        <p>No test execution data available. Generate and simulate test cases first.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 2rem;
      position: relative;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-header h1 i { color: #6366f1; }

    .page-header p {
      color: #94a3b8;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    .refresh-btn {
      position: absolute;
      right: 0;
      top: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline {
      background: transparent;
      color: #94a3b8;
      border: 1px solid #475569;
    }

    .btn-outline:hover {
      background: #334155;
      color: #f1f5f9;
    }

    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .progress-card h3 {
      color: #f1f5f9;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .progress-bar {
      display: flex;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      background: #334155;
    }

    .progress-segment {
      transition: width 0.5s ease;
    }

    .progress-segment.pass { background: #10b981; }
    .progress-segment.fail { background: #ef4444; }
    .progress-segment.pending { background: #475569; }

    .progress-legend {
      display: flex;
      gap: 1.5rem;
      margin-top: 0.75rem;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot.pass { background: #10b981; }
    .dot.fail { background: #ef4444; }
    .dot.pending { background: #475569; }

    .results-section {
      margin-top: 1rem;
    }

    .results-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .results-section h2 i { color: #6366f1; }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .empty-state i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state p {
      font-size: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  stats: DashboardStats = { totalTests: 0, passedTests: 0, failedTests: 0, notExecuted: 0 };
  testCases: TestCase[] = [];
  loading = false;

  get passPercent() { return this.stats.totalTests ? (this.stats.passedTests / this.stats.totalTests) * 100 : 0; }
  get failPercent() { return this.stats.totalTests ? (this.stats.failedTests / this.stats.totalTests) * 100 : 0; }
  get pendingPercent() { return this.stats.totalTests ? (this.stats.notExecuted / this.stats.totalTests) * 100 : 0; }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.api.getDashboard().subscribe({
      next: (res: DashboardResponse) => {
        this.stats = res.stats;
        this.testCases = res.testCases;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
