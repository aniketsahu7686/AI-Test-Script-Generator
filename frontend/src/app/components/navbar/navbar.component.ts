import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <i class="fas fa-robot"></i>
          <span>AI Test Generator</span>
        </a>
        <div class="navbar-links">
          <a routerLink="/generator" routerLinkActive="active" class="nav-link">
            <i class="fas fa-wand-magic-sparkles"></i> Generator
          </a>
          <a routerLink="/scripts" routerLinkActive="active" class="nav-link">
            <i class="fas fa-code"></i> Scripts
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <i class="fas fa-chart-bar"></i> Dashboard
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #f1f5f9;
      text-decoration: none;
    }

    .navbar-brand i {
      color: #6366f1;
      font-size: 1.5rem;
    }

    .navbar-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link:hover {
      color: #f1f5f9;
      background: #334155;
    }

    .nav-link.active {
      color: #6366f1;
      background: rgba(99, 102, 241, 0.1);
    }
  `]
})
export class NavbarComponent {}
