# AI Test Script Generator Platform

A full-stack web application that converts software requirements into structured test cases and Playwright Python automation scripts using OpenAI.

## Architecture

```
├── backend/                     (Java Spring Boot)
│   └── src/main/java/com/aitestgen/
│       ├── AiTestGeneratorApplication.java
│       ├── config/
│       │   ├── CorsConfig.java
│       │   ├── OpenAiConfig.java
│       │   └── GlobalExceptionHandler.java
│       ├── controller/
│       │   ├── TestCaseController.java
│       │   ├── ScriptController.java
│       │   ├── ExportController.java
│       │   └── DashboardController.java
│       ├── service/
│       │   ├── OpenAiService.java
│       │   ├── TestGeneratorService.java
│       │   └── ExportService.java
│       ├── model/
│       │   ├── TestCase.java
│       │   ├── AutomationScript.java
│       │   └── DashboardStats.java
│       └── dto/
│           ├── RequirementRequest.java
│           ├── TestCaseResponse.java
│           ├── ScriptRequest.java
│           ├── ScriptResponse.java
│           └── DashboardResponse.java
│
├── frontend/                    (Angular 17)
│   └── src/app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── models/
│       │   └── models.ts
│       ├── services/
│       │   └── api.service.ts
│       ├── components/
│       │   ├── navbar/
│       │   ├── test-case-table/
│       │   └── stats-cards/
│       └── pages/
│           ├── generator-page/
│           ├── scripts-page/
│           └── dashboard-page/
```

## Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm 9+**
- **OpenAI API Key**

## Backend Setup

```bash
cd backend

# Set your OpenAI API key (choose one method):

# Option A: Environment variable
export OPENAI_API_KEY=sk-your-actual-key

# Option B: Edit application.properties directly
# openai.api.key=sk-your-actual-key

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
ng serve
```

Frontend starts on **http://localhost:4200**

## API Endpoints

| Method | Endpoint                          | Description                      |
|--------|-----------------------------------|----------------------------------|
| POST   | `/api/test-cases/generate`        | Generate test cases from requirement |
| GET    | `/api/test-cases`                 | Get current test cases           |
| POST   | `/api/test-cases/simulate`        | Simulate PASS/FAIL execution     |
| GET    | `/api/test-cases/json`            | Download test cases as JSON      |
| POST   | `/api/scripts/generate`           | Generate Playwright scripts      |
| GET    | `/api/scripts`                    | Get current scripts              |
| GET    | `/api/scripts/download/{id}`      | Download single script as .py    |
| GET    | `/api/scripts/download-all`       | Download all scripts as .py      |
| GET    | `/api/export/docx`                | Download test cases as DOCX      |
| GET    | `/api/export/pdf`                 | Download test cases as PDF       |
| GET    | `/api/dashboard`                  | Get dashboard stats + test cases |

## Features

1. **Requirement Input** — Paste any user story or business requirement
2. **AI Test Case Generation** — Structured test cases with ID, scenario, steps, expected result, and type
3. **Automation Script Generation** — Playwright Python scripts using `sync_api`
4. **Download Options** — Export test cases as DOCX, PDF, or JSON; scripts as .py
5. **Execution Simulation** — Simulated PASS/FAIL results for demo purposes
6. **Dashboard** — Visual overview with stats cards, progress bar, and results table

## Tech Stack

- **Frontend:** Angular 17 (standalone components)
- **Backend:** Java 17, Spring Boot 3.2
- **AI:** OpenAI GPT-3.5-turbo API
- **PDF:** OpenPDF
- **DOCX:** Apache POI
- **Automation:** Playwright Python (generated scripts)
