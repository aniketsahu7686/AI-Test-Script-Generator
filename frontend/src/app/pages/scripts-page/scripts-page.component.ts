import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TestCase, AutomationScript } from '../../models/models';

@Component({
  selector: 'app-scripts-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1><i class="fas fa-code"></i> Automation Scripts</h1>
        <p>Generate Playwright Python automation scripts from your test cases</p>
      </div>

      <!-- Generate button -->
      <div class="card action-card">
        <div class="action-content">
          <div>
            <h3>Generate Playwright Scripts</h3>
            <p>Convert your generated test cases into runnable Python automation scripts</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="generateScripts()" [disabled]="loading">
              <i class="fas" [ngClass]="loading ? 'fa-spinner fa-spin' : 'fa-code'"></i>
              {{ loading ? 'Generating...' : 'Generate Scripts' }}
            </button>
            <button *ngIf="scripts.length > 0" class="btn btn-success" (click)="downloadAll()">
              <i class="fas fa-download"></i> Download All (.py)
            </button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert alert-error">
        <i class="fas fa-circle-exclamation"></i> {{ error }}
      </div>

      <!-- Scripts List -->
      <div *ngIf="scripts.length > 0" class="scripts-section">
        <h2><i class="fas fa-file-code"></i> Generated Scripts ({{ scripts.length }})</h2>

        <div *ngFor="let script of scripts" class="script-card">
          <div class="script-header">
            <div>
              <span class="script-id">{{ script.testCaseId }}</span>
              <span class="script-scenario">{{ script.scenario }}</span>
            </div>
            <button class="btn btn-outline btn-sm" (click)="downloadScript(script)">
              <i class="fas fa-download"></i> Download .py
            </button>
          </div>
          <pre class="script-code"><code>{{ script.scriptContent }}</code></pre>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="scripts.length === 0 && !loading" class="empty-state">
        <i class="fas fa-file-code"></i>
        <p>No scripts generated yet. Generate test cases first, then come back to create automation scripts.</p>
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

    .page-header h1 i { color: #6366f1; }

    .page-header p {
      color: #94a3b8;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 1.5rem;
    }

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
    }

    .action-content p {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
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

    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover:not(:disabled) { background: #818cf8; }
    .btn-success { background: #10b981; color: white; }
    .btn-success:hover:not(:disabled) { background: #34d399; }
    .btn-outline { background: transparent; color: #94a3b8; border: 1px solid #475569; }
    .btn-outline:hover { background: #334155; color: #f1f5f9; }
    .btn-sm { padding: 0.4rem 0.85rem; font-size: 0.8rem; }

    .alert {
      padding: 1rem 1.25rem;
      border-radius: 12px;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

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

    .scripts-section h2 i { color: #6366f1; }

    .script-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .script-header {
      background: #334155;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .script-id {
      font-family: monospace;
      font-weight: 700;
      color: #6366f1;
      margin-right: 0.75rem;
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
export class ScriptsPageComponent {
  scripts: AutomationScript[] = [];
  testCases: TestCase[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  generateScripts() {
    this.loading = true;
    this.error = '';

    // First get current test cases, then generate scripts
    this.api.getCurrentTestCases().subscribe({
      next: (testCases) => {
        if (testCases.length === 0) {
          this.error = 'No test cases found. Generate test cases first from the Generator page.';
          this.loading = false;
          return;
        }

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
      },
      error: () => {
        this.error = 'Failed to fetch test cases.';
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

  private saveFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
