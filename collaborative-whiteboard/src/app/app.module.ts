import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
