import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { EditorComponent } from './pages/editor/editor.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const appRoutes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'whiteboard/:id/:name', component: EditorComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reset/password/:token', component: ResetPasswordComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
