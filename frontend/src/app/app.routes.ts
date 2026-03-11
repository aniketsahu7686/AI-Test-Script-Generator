import { Routes } from '@angular/router';
import { GeneratorPageComponent } from './pages/generator-page/generator-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ScriptsPageComponent } from './pages/scripts-page/scripts-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'generator', pathMatch: 'full' },
  { path: 'generator', component: GeneratorPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'scripts', component: ScriptsPageComponent },
  { path: '**', redirectTo: 'generator' }
];
