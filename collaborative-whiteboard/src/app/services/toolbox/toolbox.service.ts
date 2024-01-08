import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Shape } from '../../enums/shape.enum';

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  createShapeEventEmitter = new Subject<Shape>();
  activateDrawingModeEventEmitter = new Subject<void>();
}
