export interface TestCase {
  testCaseId: string;
  scenario: string;
  steps: string[];
  expectedResult: string;
  testType: string;
  executionStatus: string;
}

export interface TestCaseResponse {
  requirement: string;
  testCases: TestCase[];
}

export interface AutomationScript {
  testCaseId: string;
  scenario: string;
  scriptContent: string;
}

export interface ScriptResponse {
  scripts: AutomationScript[];
}

export interface ExecutionResult {
  testCaseId: string;
  status: string;
}

export interface DashboardStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  notExecuted: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  testCases: TestCase[];
}
