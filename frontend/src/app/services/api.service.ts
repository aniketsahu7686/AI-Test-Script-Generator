import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestCaseResponse,
  TestCase,
  ScriptResponse,
  DashboardResponse,
  AutomationScript
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

  // Scripts
  generateScripts(testCases: TestCase[]): Observable<ScriptResponse> {
    return this.http.post<ScriptResponse>(
      `${this.baseUrl}/scripts/generate`,
      { testCases }
    );
  }

  getCurrentScripts(): Observable<AutomationScript[]> {
    return this.http.get<AutomationScript[]>(`${this.baseUrl}/scripts`);
  }

  // Exports
  downloadDocx(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/docx`, { responseType: 'blob' });
  }

  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }

  downloadJson(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/test-cases/json`, { responseType: 'blob' });
  }

  downloadScript(testCaseId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scripts/download/${testCaseId}`, { responseType: 'blob' });
  }

  downloadAllScripts(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scripts/download-all`, { responseType: 'blob' });
  }

  // Dashboard
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
  }
}
