import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Shape } from '../whiteboard/enums/shape.enum';

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  createShapeSub = new Subject<Shape>();
}
