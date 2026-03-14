import { Injectable } from '@angular/core';
import { TestCase } from '../models/models';

interface StoredTestCaseState {
  requirement: string;
  testCases: TestCase[];
  hasExecutionResults: boolean;
}

const STORAGE_KEY = 'ai-test-generator.state';

@Injectable({ providedIn: 'root' })
export class TestCaseStateService {
  private state: StoredTestCaseState;

  constructor() {
    this.state = this.loadState();
  }

  getRequirement(): string {
    return this.state.requirement;
  }

  getTestCases(): TestCase[] {
    return this.state.testCases;
  }

  hasExecutionResults(): boolean {
    return this.state.hasExecutionResults;
  }

  save(requirement: string, testCases: TestCase[], hasExecutionResults: boolean): void {
    this.state = {
      requirement: requirement ?? '',
      testCases: Array.isArray(testCases) ? testCases : [],
      hasExecutionResults: !!hasExecutionResults
    };

    this.persist();
  }

  clear(): void {
    this.state = this.defaultState();
    this.persist();
  }

  private loadState(): StoredTestCaseState {
    if (typeof window === 'undefined') {
      return this.defaultState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.defaultState();
      }

      const parsed = JSON.parse(raw) as Partial<StoredTestCaseState>;
      return {
        requirement: parsed.requirement ?? '',
        testCases: Array.isArray(parsed.testCases) ? parsed.testCases : [],
        hasExecutionResults: !!parsed.hasExecutionResults
      };
    } catch {
      return this.defaultState();
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private defaultState(): StoredTestCaseState {
    return {
      requirement: '',
      testCases: [],
      hasExecutionResults: false
    };
  }
}
