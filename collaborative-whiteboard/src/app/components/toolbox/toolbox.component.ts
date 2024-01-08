import { Component } from '@angular/core';

import { Shape } from '../../enums/shape.enum';
import { ToolboxService } from '../../services/toolbox/toolbox.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent {
  public ShapeType = Shape;
  constructor(private toolboxService: ToolboxService) {}
  onGridItemClick(shape: Shape) {
    if (shape === Shape.PATH) {
      this.toolboxService.activateDrawingModeEventEmitter.next();
    } else {
      this.toolboxService.createShapeEventEmitter.next(shape);
    }
  }
}
