import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
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
import { Line } from 'src/app/models/whiteboard/line.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';
import { CreateElementOperation } from 'src/app/dtos/create-element-operation';
import { UpdateElmentOperation } from 'src/app/dtos/update-element-operation.dto';
import { DeleteElementOperation } from 'src/app/dtos/delete-element-operation.dto';
import { Project } from 'src/app/models/project/project';
import { ProjectService } from 'src/app/services/projects/projects.service';
import { AuthSerivce } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit, OnDestroy {
  projectId: string = '';

  svgWidth = '1201';
  svgHeight = '801';
  svgObjectsGroup: HTMLElement | null = null;
  svgObjectsShapesGroup: HTMLElement | null = null;
  svgObjectsTextGroup: HTMLElement | null = null;
  svgAnchorsGroup: HTMLElement | null = null;
  svgHelpersGroup: HTMLElement | null = null;
  objects: { [key: string]: SvgObject } = {};
  drawingSurfaceModel: DrawingSurface | null = null;
  selectedElementId: string | null = null;
  drawingModeActiveted: boolean = false;

  canUserEdit = false;

  createShapeAnchorsEventEmmiter = new Subject<CreateShapeAnchorsData>();
  endShapeDragEventEmitter = new Subject<{ id: string; transform: string }>();

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
    private propertiesService: PropertiesService,
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthSerivce
  ) {
    this.createShapeSub = this.toolboxService.createShapeEventEmitter.subscribe(
      (shapeType: Shape) => {
        if (this.canUserEdit) {
          this.createNewFigure(shapeType);
        }
      }
    );
  }

  ngOnInit(): void {
    this.projectId = String(this.activatedRoute.snapshot.params['id']);
    const svg = <HTMLElement>this.document.getElementById('svg');
    svg.setAttribute('width', this.svgWidth);
    svg.setAttribute('height', this.svgHeight);

    const svgSurface = <HTMLElement>this.document.getElementById('surface');
    const svgTempObjects = <HTMLElement>(
      this.document.getElementById('temp-objects')
    );
    this.svgObjectsShapesGroup = <HTMLElement>(
      this.document.getElementById('shapes')
    );
    this.svgObjectsTextGroup = <HTMLElement>(
      this.document.getElementById('text')
    );
    this.svgObjectsGroup = <HTMLElement>this.document.getElementById('objects');
    this.svgAnchorsGroup = <HTMLElement>this.document.getElementById('anchors');
    this.svgHelpersGroup = <HTMLElement>this.document.getElementById('helpers');
    const svgTempPath = <HTMLElement>this.document.getElementById('temp-path');
    // Prepare whiteboard grid
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
        if (!!this.selectedElementId) {
          this.removeShapeAnchors(this.selectedElementId);
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

    this.endShapeDragEventEmitter.subscribe((value) => {
      this.socketService.updateWhiteboardElement(
        value.id,
        'transform',
        value.transform
      );
    });

    this.socketService.listenToProjectContentEvent().subscribe({
      next: (value) => {
        value.elements.forEach((element) => {
          const htmlElement =
            this.shapeCreationService.createShapeFromExternalData(
              element,
              this.document
            );

          if (!!htmlElement) {
            if (element['element-type'] !== 'TEXT') {
              this.svgObjectsShapesGroup?.appendChild(htmlElement);
            } else {
              this.svgObjectsTextGroup?.appendChild(htmlElement);
            }
          }

          if (element['element-type'] === 'LINE' && !!this.svgHelpersGroup) {
            const wrapperLine = this.shapeCreationService.createWrapperLine(
              this.document
            );
            this.svgHelpersGroup.appendChild(wrapperLine![0]);
            this.createLineModel(htmlElement!, wrapperLine![0]);
          } else {
            this.createShapeModel(
              element['element-type'] as Shape,
              htmlElement!
            );
          }
        });
        this.establishUserEditPermission();
      },
    });

    this.socketService.listenToLatestChangesEvent().subscribe({
      next: (operations) => {
        operations.forEach((operation) => {
          if (!!(operation as CreateElementOperation).element) {
            const op = operation as CreateElementOperation;
            const htmlElement =
              this.shapeCreationService.createShapeFromExternalData(
                op.element,
                this.document
              );

            if (!!htmlElement) {
              if (op.element['element-type'] !== 'TEXT') {
                this.svgObjectsShapesGroup?.appendChild(htmlElement);
              } else {
                this.svgObjectsTextGroup?.appendChild(htmlElement);
              }

              if (
                op.element['element-type'] === Shape.LINE &&
                !!this.svgHelpersGroup
              ) {
                const wrapperLine = this.shapeCreationService.createWrapperLine(
                  this.document
                );
                this.svgHelpersGroup.appendChild(wrapperLine![0]);
                this.createLineModel(htmlElement!, wrapperLine![0]);
              } else {
                this.createShapeModel(
                  op.element['element-type'] as Shape,
                  htmlElement!
                );
              }
            }
          } else if (!!(operation as UpdateElmentOperation)['property-name']) {
            const op = operation as UpdateElmentOperation;
            const object = this.objects[op.id];
            object.updateProperty(op['property-name'], op['property-value']);
          } else if (!!(operation as DeleteElementOperation).id) {
            console.log('dfghjklkjhgfdfghjkjhgfdghjk');
            const op = operation as DeleteElementOperation;
            const selectedElementModel = this.objects[op.id];
            this.removeShapeAnchors(op.id);
            const elementToDelete = <HTMLElement>(
              this.document.getElementById(op.id)
            );
            if (selectedElementModel instanceof Line && !!elementToDelete) {
              const wrapperElement = selectedElementModel.getWrapperElement();
              this.svgHelpersGroup?.removeChild(wrapperElement);
            }
            if (selectedElementModel instanceof Text && !!elementToDelete) {
              this.svgObjectsTextGroup?.removeChild(elementToDelete);
            } else if (!!elementToDelete) {
              console.log(JSON.stringify(op.id));
              this.svgObjectsShapesGroup?.removeChild(elementToDelete);
            }
            this.selectedElementId = null;
            this.propertiesService.clearSelectedEventEmmiter.next();
          }
          this.updateEditPermission();
        });
      },
      error: () => {
        this.router.navigate(['']);
      },
    });

    this.socketService.listenToCreateElement().subscribe({
      next: (operation) => {
        const el = this.document.getElementById(operation.element.id);
        if (!!el) {
          return;
        }
        const htmlElement =
          this.shapeCreationService.createShapeFromExternalData(
            operation.element,
            this.document
          );

        if (!!htmlElement) {
          if (operation.element['element-type'] !== 'TEXT') {
            this.svgObjectsShapesGroup?.appendChild(htmlElement);
          } else {
            this.svgObjectsTextGroup?.appendChild(htmlElement);
          }
          if (
            operation.element['element-type'] === Shape.LINE &&
            !!this.svgHelpersGroup
          ) {
            const wrapperLine = this.shapeCreationService.createWrapperLine(
              this.document
            );
            this.svgHelpersGroup.appendChild(wrapperLine![0]);
            this.createLineModel(htmlElement!, wrapperLine![0]);
          } else {
            this.createShapeModel(
              operation.element['element-type'] as Shape,
              htmlElement!
            );
          }
        }
        this.updateEditPermission();
      },
    });

    this.socketService.listenToUpdateElement().subscribe({
      next: (operation) => {
        const object = this.objects[operation.id];
        object.updateProperty(
          operation['property-name'],
          operation['property-value']
        );
        this.updateEditPermission();
      },
    });

    this.socketService.listenToDeleteElement().subscribe({
      next: (operation) => {
        const object = this.objects[operation.id];
        object.deleteElement();
        this.updateEditPermission();
      },
    });
  }

  private establishUserEditPermission() {
    this.projectService
      .getProjectMembers(this.projectId)
      .subscribe((members) => {
        const user = this.authService.getLogged();
        if (!!user) {
          const memberList = members.filter((projectMember) => {
            return projectMember.email === user.email;
          });
          if (memberList.length > 0) {
            if (memberList[0].memberRole === 'VIEWER') {
              this.canUserEdit = false;
            } else {
              this.canUserEdit = true;
            }
            this.updateEditPermission();
            return;
          }
          return;
        }
        this.router.navigate(['/dashboard']);
      });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Escape') {
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
      this.propertiesService.clearSelectedEventEmmiter.next();
    } else if (event.code === 'Delete') {
      if (!!this.selectedElementId) {
        const selectedElementModel = this.objects[this.selectedElementId];
        this.removeShapeAnchors(this.selectedElementId!);
        const elementToDelete = <HTMLElement>(
          this.document.getElementById(this.selectedElementId)
        );
        if (selectedElementModel instanceof Line) {
          const wrapperElement = selectedElementModel.getWrapperElement();
          this.svgHelpersGroup?.removeChild(wrapperElement);
        }
        if (selectedElementModel instanceof Text) {
          this.svgObjectsTextGroup?.removeChild(elementToDelete);
        } else {
          this.svgObjectsShapesGroup?.removeChild(elementToDelete);
        }
        this.socketService.deleteWhiteboardElement(
          this.projectId,
          this.selectedElementId
        );
        this.selectedElementId = null;
        this.propertiesService.clearSelectedEventEmmiter.next();
      }
    }
  }

  ngOnDestroy(): void {
    this.createShapeSub.unsubscribe();
    this.updatePropertiesSub.unsubscribe();
    this.createPathSub.unsubscribe();
    this.activateDrawingModeSub.unsubscribe();
    this.createShapeAnchorsSub.unsubscribe();
  }

  removeShapeAnchors(elementId: string) {
    const anchors = this.objects[elementId].getAnchors();
    anchors.forEach((anchor) => {
      this.svgAnchorsGroup?.removeChild(anchor);
    });
  }

  createNewFigure(shapeType: Shape, d?: string) {
    let newShape = this.shapeCreationService.createShape(
      shapeType,
      this.document,
      d
    );

    if (!!newShape && !!this.svgObjectsShapesGroup) {
      if (shapeType !== Shape.TEXT) {
        this.svgObjectsShapesGroup.appendChild(newShape[0]);
      } else {
        this.svgObjectsTextGroup?.appendChild(newShape[0]);
      }
      if (shapeType === Shape.LINE && !!this.svgHelpersGroup) {
        const wrapperLine = this.shapeCreationService.createWrapperLine(
          this.document
        );
        this.svgHelpersGroup.appendChild(wrapperLine![0]);
        this.createLineModel(newShape[0], wrapperLine![0]);
      } else {
        this.createShapeModel(shapeType, newShape[0]);
      }
      this.socketService.createWhiteboardElement(this.projectId, newShape[1]!);
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
          this.createShapeAnchorsEventEmmiter,
          this.endShapeDragEventEmitter,
          this.socketService
        );
        break;
      case Shape.CIRCLE:
        this.objects[id] = new Circle(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter,
          this.endShapeDragEventEmitter,
          this.socketService
        );
        break;
      case Shape.PATH:
        this.objects[id] = new Path(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter,
          this.endShapeDragEventEmitter,
          this.socketService
        );
        break;
      case Shape.TEXT:
        this.objects[id] = new Text(
          element,
          this.propertiesService,
          this.createShapeAnchorsEventEmmiter,
          this.endShapeDragEventEmitter,
          this.socketService
        );
        break;
      default:
        break;
    }
    this.logger.info(
      `createShapeModel: Created model for shape with id: {${id}}`
    );
  }

  createLineModel(svgLine: HTMLElement, svgLineWrapper: HTMLElement) {
    const id = svgLine.getAttribute('id')!;
    this.objects[id] = new Line(
      svgLine,
      svgLineWrapper,
      this.createShapeAnchorsEventEmmiter,
      this.propertiesService,
      this.endShapeDragEventEmitter,
      this.socketService
    );
  }

  createShapeAnchors(anchorsCoordinates: AnchorCoordinates[]) {
    return this.shapeCreationService.createElementAnchors(
      anchorsCoordinates,
      this.document
    );
  }

  private updateEditPermission() {
    for (let object in this.objects) {
      this.objects[object].canUserEdit = this.canUserEdit;
    }
    this.propertiesService.canUserEdit = this.canUserEdit;
  }
}
