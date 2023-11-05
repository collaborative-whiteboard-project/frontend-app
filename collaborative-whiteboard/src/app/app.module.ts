import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputNumberModule } from 'primeng/inputnumber';

import { AppComponent } from './app.component';
import { EditorComponent } from './pages/editor/editor.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { PropertiesComponent } from './components/properties/properties.component';
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    WhiteboardComponent,
    NavbarComponent,
    ToolboxComponent,
    PropertiesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    ColorPickerModule,
    InputNumberModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
