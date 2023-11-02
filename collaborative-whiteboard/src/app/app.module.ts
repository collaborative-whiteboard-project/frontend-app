import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { WhiteboardComponent } from './components/editor/whiteboard/whiteboard.component';

@NgModule({
  declarations: [AppComponent, EditorComponent, WhiteboardComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
