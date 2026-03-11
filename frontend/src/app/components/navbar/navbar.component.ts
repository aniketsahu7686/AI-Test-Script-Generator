import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <a routerLink="/" class="brand">
        <mat-icon class="brand-icon">smart_toy</mat-icon>
        <span class="brand-text">AI Test Generator</span>
      </a>
      <span class="spacer"></span>
      <nav class="nav-links">
        <a mat-button routerLink="/generator" routerLinkActive="active-link">
          <mat-icon>auto_fix_high</mat-icon> Generator
        </a>
        <a mat-button routerLink="/scripts" routerLinkActive="active-link">
          <mat-icon>code</mat-icon> Scripts
        </a>
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon>dashboard</mat-icon> Dashboard
        </a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #f1f5f9;
    }

    .brand-icon {
      color: #6366f1;
      font-size: 1.75rem;
      height: 28px;
      width: 28px;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .spacer {
      flex: 1;
    }

    .nav-links {
      display: flex;
      gap: 0.25rem;
    }

    .nav-links a {
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      border-radius: 8px;
    }
  `]
})
export class NavbarComponent {}
