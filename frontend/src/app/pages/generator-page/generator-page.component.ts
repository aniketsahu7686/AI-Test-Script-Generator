import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../services/api.service';
import { TestGeneratorService } from '../../services/test-generator.service';
import { TestCase } from '../../models/models';
import { TestCaseTableComponent } from '../../components/test-case-table/test-case-table.component';

@Component({
  selector: 'app-generator-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDividerModule, TestCaseTableComponent
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>
          <mat-icon class="header-icon">auto_fix_high</mat-icon>
          Test Case Generator
        </h1>
        <p>Paste a requirement or user story and let AI generate comprehensive test cases</p>
      </div>

      <!-- Input Section -->
      <mat-card class="input-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Requirement / User Story</mat-label>
            <textarea
              matInput
              [(ngModel)]="requirement"
              placeholder="e.g., User should be able to login using email and password."
              rows="4">
            </textarea>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary"
            (click)="generateTestCases()"
            [disabled]="loading || !requirement.trim()">
            <mat-spinner *ngIf="loading" [diameter]="20" class="btn-spinner"></mat-spinner>
            <mat-icon *ngIf="!loading">auto_fix_high</mat-icon>
            {{ loading ? 'Generating test cases...' : 'Generate Test Cases' }}
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Error -->
      <mat-card *ngIf="error" class="error-card">
        <mat-card-content class="error-content">
          <mat-icon class="error-icon">error</mat-icon>
          {{ error }}
        </mat-card-content>
      </mat-card>

      <!-- Results -->
      <div *ngIf="testCases.length > 0" class="results-section">
        <div class="section-header">
          <h2>
            <mat-icon class="header-icon">checklist</mat-icon>
            Generated Test Cases ({{ testCases.length }})
          </h2>
          <div class="action-buttons">
            <button mat-stroked-button (click)="downloadDocx()">
              <mat-icon>description</mat-icon> DOCX
            </button>
            <button mat-stroked-button (click)="downloadPdf()">
              <mat-icon>picture_as_pdf</mat-icon> PDF
            </button>
            <button mat-stroked-button (click)="downloadJson()">
              <mat-icon>data_object</mat-icon> JSON
            </button>

            <mat-divider [vertical]="true" class="btn-divider"></mat-divider>

            <button mat-raised-button color="accent"
              (click)="simulateExecution()" [disabled]="simulating">
              <mat-spinner *ngIf="simulating" [diameter]="20" class="btn-spinner"></mat-spinner>
              <mat-icon *ngIf="!simulating">play_arrow</mat-icon>
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

    .page-header p {
      color: #94a3b8;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    .header-icon {
      color: #6366f1;
    }

    .input-card {
      margin-bottom: 1.5rem;
    }

    .full-width {
      width: 100%;
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

    .error-icon {
      color: #ef4444;
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
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn-divider {
      height: 32px;
      margin: 0 4px;
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

  constructor(
    private api: ApiService,
    private testGeneratorService: TestGeneratorService
  ) {}

  generateTestCases() {
    this.loading = true;
    this.error = '';
    this.hasExecutionResults = false;

    this.testGeneratorService.generateTestCases(this.requirement).subscribe({
      next: (res) => {
        this.testCases = res.testCases;
        if (this.testCases.length === 0) {
          this.error = 'No test cases were returned by the API.';
        }
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
