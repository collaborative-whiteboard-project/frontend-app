import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ShapeCreationService } from '../../services/whiteboard/shape-creation.service';
import { Shape } from '../../enums/shape.enum';
import { ToolboxService } from '../../services/toolbox/toolbox.service';
import { Subscription } from 'rxjs';
import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from 'src/app/models/whiteboard/svg-object.model';
import { Surface } from 'src/app/models/whiteboard/surface.model';
import { Rectangle } from 'src/app/models/whiteboard/rectangle.model';
import { Circle } from 'src/app/models/whiteboard/circle.model';
import { Path } from 'src/app/models/whiteboard/path.model';
import { DrawingSurface } from 'src/app/models/whiteboard/drawing-surface.model';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit, OnDestroy {
  svgWidth = '1201';
  svgHeight = '801';
  createShapeSub: Subscription;
  activateDrawingModeSub = new Subscription();
  // updatePropertiesSub: Subscription;
  createPathSub = new Subscription();
  drawingSurfaceModel: DrawingSurface | null = null;
  objects: { [key: string]: SvgObject } = {};
  svgObjects: HTMLElement | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private shapeCreationService: ShapeCreationService,
    private toolboxService: ToolboxService,
    private propertiesService: PropertiesService
  ) {
    this.createShapeSub = this.toolboxService.createShapeEventEmmiter.subscribe(
      (shapeType: Shape) => {
        this.createNewFigure(shapeType);
      }
    );
  }

  ngOnInit(): void {
    // Prepare whiteboard grid
    const svg = <HTMLElement>this.document.getElementById('svg');
    svg.setAttribute('width', this.svgWidth);
    svg.setAttribute('height', this.svgHeight);
    const svgSurface = <HTMLElement>this.document.getElementById('surface');
    this.svgObjects = <HTMLElement>this.document.getElementById('objects');
    const svgTempObjects = <HTMLElement>(
      this.document.getElementById('temp-objects')
    );
    const svgTempPath = <HTMLElement>this.document.getElementById('temp-path');
    const surfaceModel = new Surface(
      svgSurface,
      this.propertiesService,
      this.document
    );
    const svgDrawingSurface = this.shapeCreationService.createDrawingSurface(
      this.svgWidth,
      this.svgHeight,
      this.document
    );
    this.drawingSurfaceModel = new DrawingSurface(
      svgDrawingSurface,
      svgTempPath,
      svgTempObjects
    );
    surfaceModel.resizeGrid('100', '100', '10', '10');

    this.document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.drawingSurfaceModel?.deactivateDrawinSurface();
      }
    });

    this.createPathSub =
      this.drawingSurfaceModel.createPathEventEmmiter.subscribe((d: string) => {
        this.createNewFigure(Shape.PATH, d);
      });

    this.activateDrawingModeSub =
      this.toolboxService.activateDrawingModeEventEmmiter.subscribe(() => {
        this.drawingSurfaceModel?.activateDrawingSurface();
      });
  }

  ngOnDestroy(): void {
    // this.createShapeSub.unsubscribe();
    // this.updatePropertiesSub.unsubscribe();
    this.createPathSub.unsubscribe();
  }

  createNewFigure(shapeType: Shape, d?: string) {
    let newShape = this.shapeCreationService.createShape(
      shapeType,
      this.document,
      d
    );
    if (!!newShape && !!this.svgObjects) {
      this.svgObjects.appendChild(newShape);
      this.createShapeModel(shapeType, newShape);
    }
  }

  createShapeModel(shapeType: Shape, element: HTMLElement) {
    const id = element.getAttribute('id');
    if (!id) {
      return;
    }
    switch (shapeType) {
      case Shape.RECTANGLE:
        this.objects[id] = new Rectangle(element, this.propertiesService);
        break;
      case Shape.CIRCLE:
        this.objects[id] = new Circle(element, this.propertiesService);
        break;
      case Shape.PATH:
        this.objects[id] = new Path(element, this.propertiesService);
        break;

      default:
        break;
    }
  }
}
