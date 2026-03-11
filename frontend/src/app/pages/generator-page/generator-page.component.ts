import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TestCase } from '../../models/models';
import { TestCaseTableComponent } from '../../components/test-case-table/test-case-table.component';

@Component({
  selector: 'app-generator-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TestCaseTableComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1><i class="fas fa-wand-magic-sparkles"></i> Test Case Generator</h1>
        <p>Paste a requirement or user story and let AI generate comprehensive test cases</p>
      </div>

      <!-- Input Section -->
      <div class="card input-card">
        <label class="input-label">Requirement / User Story</label>
        <textarea
          [(ngModel)]="requirement"
          class="requirement-input"
          placeholder="e.g., User should be able to login using email and password."
          rows="4"
        ></textarea>
        <div class="input-actions">
          <button
            class="btn btn-primary"
            (click)="generateTestCases()"
            [disabled]="loading || !requirement.trim()">
            <i class="fas" [ngClass]="loading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'"></i>
            {{ loading ? 'Generating...' : 'Generate Test Cases' }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert alert-error">
        <i class="fas fa-circle-exclamation"></i> {{ error }}
      </div>

      <!-- Results -->
      <div *ngIf="testCases.length > 0" class="results-section">
        <div class="section-header">
          <h2><i class="fas fa-list-check"></i> Generated Test Cases ({{ testCases.length }})</h2>
          <div class="action-buttons">
            <button class="btn btn-outline" (click)="downloadDocx()">
              <i class="fas fa-file-word"></i> DOCX
            </button>
            <button class="btn btn-outline" (click)="downloadPdf()">
              <i class="fas fa-file-pdf"></i> PDF
            </button>
            <button class="btn btn-outline" (click)="downloadJson()">
              <i class="fas fa-file-code"></i> JSON
            </button>
            <button class="btn btn-success" (click)="simulateExecution()" [disabled]="simulating">
              <i class="fas" [ngClass]="simulating ? 'fa-spinner fa-spin' : 'fa-play'"></i>
              {{ simulating ? 'Running...' : 'Simulate Execution' }}
            </button>
          </div>
        </div>

        <app-test-case-table
          [testCases]="testCases"
          [showStatus]="hasExecutionResults">
        </app-test-case-table>
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

    .input-label {
      display: block;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .requirement-input {
      width: 100%;
      background: #334155;
      border: 1px solid #475569;
      border-radius: 12px;
      padding: 1rem;
      color: #f1f5f9;
      font-size: 0.95rem;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.2s;
    }

    .requirement-input:focus {
      outline: none;
      border-color: #6366f1;
    }

    .requirement-input::placeholder {
      color: #64748b;
    }

    .input-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
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
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #818cf8;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #34d399;
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

    .results-section {
      margin-top: 2rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-header h2 i { color: #6366f1; }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `]
})
export class GeneratorPageComponent {
  requirement = '';
  testCases: TestCase[] = [];
  loading = false;
  simulating = false;
  error = '';
  hasExecutionResults = false;

  constructor(private api: ApiService) {}

  generateTestCases() {
    this.loading = true;
    this.error = '';
    this.hasExecutionResults = false;

    this.api.generateTestCases(this.requirement).subscribe({
      next: (res) => {
        this.testCases = res.testCases;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to generate test cases. Please try again.';
        this.loading = false;
      }
    });
  }

  simulateExecution() {
    this.simulating = true;
    this.api.simulateExecution().subscribe({
      next: (res) => {
        this.testCases = res;
        this.hasExecutionResults = true;
        this.simulating = false;
      },
      error: () => {
        this.error = 'Failed to simulate execution.';
        this.simulating = false;
      }
    });
  }

  downloadDocx() {
    this.api.downloadDocx().subscribe(blob => this.saveFile(blob, 'test-cases.docx'));
  }

  downloadPdf() {
    this.api.downloadPdf().subscribe(blob => this.saveFile(blob, 'test-cases.pdf'));
  }

  downloadJson() {
    this.api.downloadJson().subscribe(blob => this.saveFile(blob, 'test-cases.json'));
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
