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
import { PropertiesService } from 'src/app/services/properties/properties.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit, OnDestroy {
  createShapeSub: Subscription;
  updatePropertiesSub: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private mouseController: MouseService,
    private shapeCreationService: ShapeCreationService,
    private toolboxService: ToolboxService,
    private propertiesService: PropertiesService
  ) {
    this.createShapeSub = this.toolboxService.createShapeSub.subscribe(
      (next: Shape) => {
        this.createNewElement(next);
      }
    );

    this.updatePropertiesSub =
      this.propertiesService.updatePropertiesEventEmmiter.subscribe(
        (properties) => {
          const element = document.getElementById(properties.id);
          if (!!element) {
            element.setAttributeNS(null, 'fill', properties.fill);
            element.setAttributeNS(
              null,
              'stroke-width',
              properties['stroke-width']
            );
            element.setAttributeNS(null, 'stroke', properties.stroke);
          }
        }
      );
  }

  ngOnInit(): void {
    // Prepare whiteboard grid
    const svgSurface = <HTMLElement>this.document.getElementById('surface');

    const surface = new Surface(
      this.mouseController,
      svgSurface,
      this.document,
      this.propertiesService
    );
    surface.resizeGrid('90', '90', '9', '9');
  }

  ngOnDestroy(): void {
    this.createShapeSub.unsubscribe();
    this.updatePropertiesSub.unsubscribe();
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
        new Rectangle(this.mouseController, element, this.propertiesService);
        break;
      case Shape.CIRCLE:
        new Circle(this.mouseController, element, this.propertiesService);
        break;
      case Shape.DIAMOND:
        break;

      default:
        break;
    }
  }
}
