import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TestCase, TestCaseResponse } from '../models/models';

const isNetlifyHost = typeof window !== 'undefined' && window.location.hostname.endsWith('netlify.app');
const API_BASE_URL = isNetlifyHost ? '' : 'https://ai-test-script-generator.onrender.com';

@Injectable({ providedIn: 'root' })
export class TestGeneratorService {
  constructor(private http: HttpClient) {}

  generateTestCases(requirement: string): Observable<TestCaseResponse> {
    return this.http
      .post<any>(`${API_BASE_URL}/api/generate`, { requirement })
      .pipe(
        map((response) => ({
          requirement,
          testCases: this.normalizeTestCases(response)
        }))
      );
  }

  private normalizeTestCases(response: any): TestCase[] {
    const raw =
      response?.testCases ??
      response?.generatedTestCases ??
      response?.data?.testCases ??
      [];

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map((tc: any, index: number) => ({
      testCaseId: tc?.testCaseId ?? tc?.id ?? `TC_${String(index + 1).padStart(3, '0')}`,
      scenario: tc?.scenario ?? '',
      steps: Array.isArray(tc?.steps) ? tc.steps : [],
      expectedResult: tc?.expectedResult ?? tc?.expected_result ?? '',
      testType: tc?.testType ?? tc?.type ?? 'POSITIVE',
      executionStatus: tc?.executionStatus ?? 'NOT_EXECUTED'
    }));
  }
}
