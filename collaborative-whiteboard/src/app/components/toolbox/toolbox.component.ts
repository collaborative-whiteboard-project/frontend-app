import { Component } from '@angular/core';
import { ToolboxService } from '../../services/toolbox/toolbox.service';
import { Shape } from '../../enums/shape.enum';

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
      this.toolboxService.activateDrawingModeEventEmmiter.next();
    } else {
      this.toolboxService.createShapeEventEmmiter.next(shape);
    }
  }
}
