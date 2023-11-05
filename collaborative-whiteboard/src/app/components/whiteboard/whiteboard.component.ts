import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MouseService } from '../../services/whiteboard/mouse.service';
import { Rectangle } from '../../models/whiteboard/rectangle.model';
import { Surface } from '../../models/whiteboard/surface.model';
import { ShapeCreationService } from '../../services/whiteboard/shape-creation.service';
import { Shape } from '../../enums/shape.enum';
import { ToolboxService } from '../../services/toolbox/toolbox.service';
import { Subscription } from 'rxjs';
import { Circle } from '../../models/whiteboard/circle.model';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit, OnDestroy {
  createShapeSub: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private mouseController: MouseService,
    private shapeCreationService: ShapeCreationService,
    private toolboxService: ToolboxService
  ) {
    this.createShapeSub = this.toolboxService.createShapeSub.subscribe(
      (next: Shape) => {
        this.createNewElement(next);
      }
    );
  }

  ngOnInit(): void {
    // Prepare whiteboard grid
    const svgSurface = <HTMLElement>this.document.getElementById('surface');

    const surface = new Surface(
      this.mouseController,
      svgSurface,
      this.document
    );
    surface.resizeGrid('90', '90', '9', '9');
  }

  ngOnDestroy(): void {
    this.createShapeSub.unsubscribe();
  }

  createNewElement(shapeType: Shape) {
    const newShape = this.shapeCreationService.createShape(
      shapeType,
      this.document
    );
    const objects = this.document.getElementById('objects');
    if (!!newShape && !!objects) {
      objects.appendChild(newShape);
      this.createElementModel(shapeType, newShape);
    }
  }

  createElementModel(shapeType: Shape, element: HTMLElement) {
    switch (shapeType) {
      case Shape.RECTANGLE:
        new Rectangle(this.mouseController, element);
        break;
      case Shape.CIRCLE:
        new Circle(this.mouseController, element);
        break;
      case Shape.DIAMOND:
        break;

      default:
        break;
    }
  }
}
