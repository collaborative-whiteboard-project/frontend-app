import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MenuModule } from 'primeng/menu';

import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppComponent } from './app.component';
import { EditorComponent } from './pages/editor/editor.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectThumbnailComponent } from './components/project-thumbnail/project-thumbnail.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ManageProjectPanelComponent } from './components/manage-project-panel/manage-project-panel.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    WhiteboardComponent,
    NavbarComponent,
    ToolboxComponent,
    PropertiesComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ProjectThumbnailComponent,
    AdminPanelComponent,
    UserPanelComponent,
    ManageProjectPanelComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MembersListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    ColorPickerModule,
    InputNumberModule,
    CardModule,
    PasswordModule,
    TabViewModule,
    MenuModule,
    SplitButtonModule,
    DialogModule,
    ChipModule,
    AvatarModule,
    TableModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    ListboxModule,
    SelectButtonModule,
    LoggerModule.forRoot({
      //serverLoggingUrl: 'http://localhost:4200/', // Replace with YOUR API
      level: NgxLoggerLevel.TRACE,
      //serverLogLevel: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false,
    }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
