import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { EditorComponent } from './pages/editor/editor.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const appRoutes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'whiteboard/:id', component: EditorComponent },
  { path: 'dashboard', component: DashboardComponent },
  // {path: 'not-found', component: PageNotFoundComponent},
  // {path: '**',  redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
