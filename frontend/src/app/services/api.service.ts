import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestCaseResponse,
  TestCase,
  ScriptResponse,
  DashboardResponse,
  AutomationScript,
  ExecutionResult
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Test Cases
  generateTestCases(requirement: string): Observable<TestCaseResponse> {
    return this.http.post<TestCaseResponse>(
      `${this.baseUrl}/test-cases/generate`,
      { requirement }
    );
  }

  getCurrentTestCases(): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(`${this.baseUrl}/test-cases`);
  }

  simulateExecution(): Observable<TestCase[]> {
    return this.http.post<TestCase[]>(`${this.baseUrl}/test-cases/simulate`, {});
  }

  simulateExecutionWithInput(testCases: TestCase[]): Observable<ExecutionResult[]> {
    return this.http.post<ExecutionResult[]>(
      `${this.baseUrl}/test-cases/simulate-execution`,
      { testCases }
    );
  }

  // Scripts
  generateScripts(testCases: TestCase[]): Observable<ScriptResponse> {
    return this.http.post<ScriptResponse>(
      `${this.baseUrl}/scripts/generate-scripts`,
      { testCases }
    );
  }

  getCurrentScripts(): Observable<AutomationScript[]> {
    return this.http.get<AutomationScript[]>(`${this.baseUrl}/scripts`);
  }

  // Downloads
  downloadDocx(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/testcases/docx`, { responseType: 'blob' });
  }

  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/testcases/pdf`, { responseType: 'blob' });
  }

  downloadJson(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/testcases/json`, { responseType: 'blob' });
  }

  downloadScript(testCaseId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scripts/download/${testCaseId}`, { responseType: 'blob' });
  }

  downloadAllScripts(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scripts/download-all`, { responseType: 'blob' });
  }

  downloadScriptsPython(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scripts/download/scripts/python`, { responseType: 'blob' });
  }

  // Dashboard
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
  }
}
