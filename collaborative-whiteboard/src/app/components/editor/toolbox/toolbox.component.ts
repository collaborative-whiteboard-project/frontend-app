import { Component } from '@angular/core';
import { ToolboxService } from '../services/toolbox.service';
import { Shape } from '../whiteboard/enums/shape.enum';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent {
  public ShapeType = Shape;
  constructor(private toolboxService: ToolboxService) {}
  onGridItemClick(shape: Shape) {
    this.toolboxService.createShapeSub.next(shape);
  }
}
