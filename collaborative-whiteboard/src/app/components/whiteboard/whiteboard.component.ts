import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { Shape } from '../../enums/shape.enum';
import { Path } from 'src/app/models/whiteboard/path.model';
import { Text } from 'src/app/models/whiteboard/text.model';
import { Circle } from 'src/app/models/whiteboard/circle.model';
import { Surface } from 'src/app/models/whiteboard/surface.model';
import { Rectangle } from 'src/app/models/whiteboard/rectangle.model';
import { SvgObject } from 'src/app/models/whiteboard/svg-object.model';
import { DrawingSurface } from 'src/app/models/whiteboard/drawing-surface.model';
import { ToolboxService } from '../../services/toolbox/toolbox.service';
import { PropertiesService } from 'src/app/services/properties/properties.service';
import { ShapeCreationService } from '../../services/whiteboard/shape-creation.service';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit, OnDestroy {
  svgWidth = '1201';
  svgHeight = '801';
  svgObjectsGroup: HTMLElement | null = null;
  svgAnchorsGroup: HTMLElement | null = null;
  objects: { [key: string]: SvgObject } = {};
  drawingSurfaceModel: DrawingSurface | null = null;
  selectedElementId: string | null = null;
  drawingModeActiveted: boolean = false;

  createShapeAnchorsEventEmmiter = new Subject<CreateShapeAnchorsData>();

  createShapeSub = new Subscription();
  activateDrawingModeSub = new Subscription();
  updatePropertiesSub = new Subscription();
  createPathSub = new Subscription();
  createShapeAnchorsSub = new Subscription();

  constructor(
    private logger: NGXLogger,
    @Inject(DOCUMENT) private document: Document,
    private shapeCreationService: ShapeCreationService,
    private toolboxService: ToolboxService,
    private propertiesService: PropertiesService
  ) {
    this.createShapeSub = this.toolboxService.createShapeEventEmitter.subscribe(
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
    const svgTempObjects = <HTMLElement>(
      this.document.getElementById('temp-objects')
    );
    this.svgObjectsGroup = <HTMLElement>this.document.getElementById('objects');
    this.svgAnchorsGroup = <HTMLElement>this.document.getElementById('anchors');
    const svgTempPath = <HTMLElement>this.document.getElementById('temp-path');

    const surfaceModel = new Surface(
      svgSurface,
      this.propertiesService,
      this.document
    );
    surfaceModel.resizeGrid('100', '100', '10', '10');

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
    this.document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.drawingModeActiveted) {
          this.drawingSurfaceModel?.deactivateDrawinSurface();
          this.drawingModeActiveted = false;
        }
        if (!!this.selectedElementId) {
          const anchors = this.objects[this.selectedElementId!].getAnchors();
          anchors.forEach((anchor) => {
            this.svgAnchorsGroup?.removeChild(anchor);
          });
          this.selectedElementId = null;
        }
      } else if (event.key === 'Delete') {
        if (!!this.selectedElementId) {
          const anchors = this.objects[this.selectedElementId].getAnchors();
          anchors.forEach((anchor) => {
            this.svgAnchorsGroup?.removeChild(anchor);
          });
          const elementToDelete = <HTMLElement>(
            this.document.getElementById(this.selectedElementId)
          );
          this.svgObjectsGroup?.removeChild(elementToDelete);
          this.selectedElementId = null;
        }
      }
    });

    this.createPathSub =
      this.drawingSurfaceModel.createPathEventEmmiter.subscribe((d: string) => {
        this.createNewFigure(Shape.PATH, d);
      });

    this.activateDrawingModeSub =
      this.toolboxService.activateDrawingModeEventEmitter.subscribe(() => {
        this.drawingSurfaceModel?.activateDrawingSurface();
        this.drawingModeActiveted = true;
      });

    this.updatePropertiesSub =
      this.propertiesService.updatePropertiesEventEmmiter.subscribe(
        (properties) => {
          const element = this.objects[properties.id];
          element.updateProperties(properties);
        }
      );

    this.createShapeAnchorsSub = this.createShapeAnchorsEventEmmiter.subscribe(
      (data) => {
        if (data.shapeId === this.selectedElementId) {
          return;
        }

        if (!!this.selectedElementId) {
          const oldSlectedElementAnchors =
            this.objects[this.selectedElementId].getAnchors();
          oldSlectedElementAnchors.forEach((anchor) => {
            this.svgAnchorsGroup?.removeChild(anchor);
          });
          this.selectedElementId = null;
        }

        this.selectedElementId = data.shapeId;
        if (data.anchorsCoordinates.length !== 0) {
          const anchors = this.shapeCreationService.createElementAnchors(
            data.anchorsCoordinates,
            this.document
          );
          anchors.forEach((anchor) =>
            this.svgAnchorsGroup?.appendChild(anchor)
          );
          this.objects[data.shapeId].setAnchors(anchors);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.createShapeSub.unsubscribe();
    this.updatePropertiesSub.unsubscribe();
    this.createPathSub.unsubscribe();
    this.activateDrawingModeSub.unsubscribe();
    this.createShapeAnchorsSub.unsubscribe();
  }

  createNewFigure(shapeType: Shape, d?: string) {
    let newShape = this.shapeCreationService.createShape(
      shapeType,
      this.document,
      d
    );
    if (!!newShape && !!this.svgObjectsGroup) {
      this.svgObjectsGroup.appendChild(newShape);
      this.createShapeModel(shapeType, newShape);
    }
  }

  createShapeModel(shapeType: Shape, element: HTMLElement) {
    const id = element.getAttribute('id');
    if (!id) {
      this.logger.error(
        `createShapeModel: Element's property 'id' doesn't exist.`
      );
      return;
    }
    switch (shapeType) {
      case Shape.RECTANGLE:
        this.objects[id] = new Rectangle(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter
        );
        break;
      case Shape.CIRCLE:
        this.objects[id] = new Circle(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter
        );
        break;
      case Shape.PATH:
        this.objects[id] = new Path(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter
        );
        break;
      case Shape.TEXT:
        this.objects[id] = new Text(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter
        );
        break;
      default:
        break;
    }
    this.logger.info(`Model for shape with id: {${id}}`);
  }

  createShapeAnchors(anchorsCoordinates: AnchorCoordinates[]) {
    return this.shapeCreationService.createElementAnchors(
      anchorsCoordinates,
      this.document
    );
  }
}
