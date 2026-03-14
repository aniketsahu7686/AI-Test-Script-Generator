import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../services/api.service';
import { TestCaseStateService } from '../../services/test-case-state.service';
import { TestCase, AutomationScript } from '../../models/models';

@Component({
  selector: 'app-scripts-page',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatDividerModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>
          <mat-icon class="header-icon">code</mat-icon>
          Automation Scripts
        </h1>
        <p>Generate Playwright Python automation scripts from your test cases</p>
      </div>

      <!-- Action Card -->
      <mat-card class="action-card">
        <mat-card-content class="action-content">
          <div>
            <h3>Generate Playwright Scripts</h3>
            <p class="subtitle">Convert your generated test cases into runnable Python automation scripts</p>
          </div>
          <div class="action-buttons">
            <button mat-raised-button color="primary"
              (click)="generateScripts()" [disabled]="loading">
              <mat-spinner *ngIf="loading" [diameter]="20" class="btn-spinner"></mat-spinner>
              <mat-icon *ngIf="!loading">code</mat-icon>
              {{ loading ? 'Generating...' : 'Generate Scripts' }}
            </button>
            <button mat-raised-button color="accent" *ngIf="scripts.length > 0"
              (click)="downloadAll()">
              <mat-icon>download</mat-icon> Download All (.py)
            </button>
            <button mat-stroked-button *ngIf="scripts.length > 0"
              (click)="downloadPython()">
              <mat-icon>terminal</mat-icon> Download Python
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Error -->
      <mat-card *ngIf="error" class="error-card">
        <mat-card-content class="error-content">
          <mat-icon class="error-icon">error</mat-icon>
          {{ error }}
        </mat-card-content>
      </mat-card>

      <!-- Scripts List -->
      <div *ngIf="scripts.length > 0" class="scripts-section">
        <h2>
          <mat-icon class="header-icon">description</mat-icon>
          Generated Scripts ({{ scripts.length }})
        </h2>

        <mat-card *ngFor="let script of scripts" class="script-card">
          <div class="script-header">
            <div class="script-info">
              <span class="script-id">{{ script.testCaseId }}</span>
              <span class="script-scenario">{{ script.scenario }}</span>
            </div>
            <button mat-stroked-button (click)="downloadScript(script)">
              <mat-icon>download</mat-icon> Download .py
            </button>
          </div>
          <mat-divider></mat-divider>
          <pre class="script-code"><code>{{ script.scriptContent }}</code></pre>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="scripts.length === 0 && !loading && testCases.length === 0" class="empty-state">
        <mat-icon class="empty-icon">code_off</mat-icon>
        <p>No scripts generated yet. Generate test cases first, then come back to create automation scripts.</p>
      </div>

      <div *ngIf="scripts.length === 0 && !loading && testCases.length > 0" class="empty-state">
        <mat-icon class="empty-icon">fact_check</mat-icon>
        <p>{{ testCases.length }} test cases are ready. Click Generate Scripts to create automation scripts.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-header p {
      color: #94a3b8;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    .header-icon { color: #6366f1; }

    .action-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .action-content h3 {
      color: #f1f5f9;
      font-size: 1.1rem;
      margin: 0;
    }

    .subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    .error-card {
      background: rgba(239, 68, 68, 0.1) !important;
      border: 1px solid rgba(239, 68, 68, 0.3) !important;
      margin-top: 1rem;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fca5a5;
      font-size: 0.9rem;
    }

    .error-icon { color: #ef4444; }

    .scripts-section {
      margin-top: 2rem;
    }

    .scripts-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .script-card {
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .script-header {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      background: #334155;
    }

    .script-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .script-id {
      font-family: monospace;
      font-weight: 700;
      color: #6366f1;
    }

    .script-scenario {
      color: #cbd5e1;
      font-size: 0.9rem;
    }

    .script-code {
      padding: 1rem;
      margin: 0;
      overflow-x: auto;
      font-size: 0.8rem;
      line-height: 1.6;
      color: #a5f3fc;
      background: #0f172a;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 3rem;
      height: 48px;
      width: 48px;
      margin-bottom: 1rem;
    }

    .empty-state p {
      font-size: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class ScriptsPageComponent implements OnInit {
  scripts: AutomationScript[] = [];
  testCases: TestCase[] = [];
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private testCaseState: TestCaseStateService
  ) {}

  ngOnInit() {
    const cachedTestCases = this.testCaseState.getTestCases();
    if (cachedTestCases.length > 0) {
      this.testCases = cachedTestCases;
      return;
    }

    this.api.getCurrentTestCases().subscribe({
      next: (testCases) => {
        if (testCases.length > 0) {
          this.testCases = testCases;
          this.testCaseState.save(
            this.testCaseState.getRequirement(),
            testCases,
            this.testCaseState.hasExecutionResults()
          );
        }
      },
      error: () => {
        // Keep quiet; explicit Generate action already shows errors.
      }
    });
  }

  generateScripts() {
    this.loading = true;
    this.error = '';
    const cachedTestCases = this.testCaseState.getTestCases();

    if (cachedTestCases.length > 0) {
      this.testCases = cachedTestCases;
      this.generateScriptsFromCases(cachedTestCases);
      return;
    }

    this.api.getCurrentTestCases().subscribe({
      next: (testCases) => {
        if (testCases.length === 0) {
          this.error = 'No test cases found. Generate test cases first from the Generator page.';
          this.loading = false;
          return;
        }

        this.testCases = testCases;
        this.testCaseState.save(this.testCaseState.getRequirement(), testCases, this.testCaseState.hasExecutionResults());
        this.generateScriptsFromCases(testCases);
      },
      error: () => {
        this.error = 'Failed to fetch test cases.';
        this.loading = false;
      }
    });
  }

  private generateScriptsFromCases(testCases: TestCase[]) {
    this.api.generateScripts(testCases).subscribe({
      next: (res) => {
        this.scripts = res.scripts;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to generate scripts.';
        this.loading = false;
      }
    });
  }

  downloadScript(script: AutomationScript) {
    const blob = new Blob([script.scriptContent], { type: 'text/x-python' });
    const filename = `test_${script.testCaseId.toLowerCase().replace(/\s+/g, '_')}.py`;
    this.saveFile(blob, filename);
  }

  downloadAll() {
    this.api.downloadAllScripts().subscribe(blob => {
      this.saveFile(blob, 'automation_scripts.py');
    });
  }

  downloadPython() {
    this.api.downloadScriptsPython().subscribe(blob => {
      this.saveFile(blob, 'playwright_scripts.py');
    });
  }

  private saveFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
