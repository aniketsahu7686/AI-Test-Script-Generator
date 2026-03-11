import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../models/models';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total"><i class="fas fa-list-check"></i></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalTests }}</span>
          <span class="stat-label">Total Tests</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon passed"><i class="fas fa-circle-check"></i></div>
        <div class="stat-info">
          <span class="stat-value passed-text">{{ stats.passedTests }}</span>
          <span class="stat-label">Passed</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon failed"><i class="fas fa-circle-xmark"></i></div>
        <div class="stat-info">
          <span class="stat-value failed-text">{{ stats.failedTests }}</span>
          <span class="stat-label">Failed</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending"><i class="fas fa-clock"></i></div>
        <div class="stat-info">
          <span class="stat-value pending-text">{{ stats.notExecuted }}</span>
          <span class="stat-label">Not Executed</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }

    .stat-icon.total { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
    .stat-icon.passed { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .stat-icon.failed { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .stat-icon.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f1f5f9;
    }

    .passed-text { color: #10b981; }
    .failed-text { color: #ef4444; }
    .pending-text { color: #f59e0b; }

    .stat-label {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 0.1rem;
    }
  `]
})
export class StatsCardsComponent {
  @Input() stats: DashboardStats = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    notExecuted: 0
  };
}
