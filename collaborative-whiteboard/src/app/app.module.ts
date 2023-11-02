import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { WhiteboardComponent } from './components/editor/whiteboard/whiteboard.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent, EditorComponent, WhiteboardComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
