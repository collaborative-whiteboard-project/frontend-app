import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { WhiteboardComponent } from './components/editor/whiteboard/whiteboard.component';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolboxComponent } from './components/editor/toolbox/toolbox.component';
import { PropertiesComponent } from './components/editor/properties/properties.component';
@NgModule({
  declarations: [AppComponent, EditorComponent, WhiteboardComponent, NavbarComponent, ToolboxComponent, PropertiesComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
