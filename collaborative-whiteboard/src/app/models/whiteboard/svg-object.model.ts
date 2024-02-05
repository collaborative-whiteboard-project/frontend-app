import { Subject } from 'rxjs';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';
import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';
import { transform } from 'typescript';

export enum Anchor {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3,
}

export abstract class SvgObject {
  mouseDown = false;
  anchorMouseDown = false;
  dragX = 0;
  dragY = 0;
  anchorDragX = 0;
  anchorDragY = 0;
  translateX = 0;
  translateY = 0;
  dragOperation = false;
  anchors: HTMLElement[] = [];
  canUserEdit = true;
  constructor(
    protected svgElement: HTMLElement,
    protected propertiesService: PropertiesService,
    protected createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>,
    protected endShapeDragEventEmitter: Subject<{
      id: string;
      transform: string;
    }>,
    protected socketService: SocketService
  ) {
    this.svgElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.svgElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.svgElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.svgElement.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );

    const transform = this.svgElement.getAttribute('transform');

    if (!!transform) {
      const parsedTransform = parseTransformAttribute(transform);
      this.translateX = +parsedTransform[0].values[0];
      this.translateY = +parsedTransform[0].values[1];
    }
  }

  onMouseDown(event: Event) {
    const parentElement = this.svgElement.parentElement;
    if (!!parentElement) {
      // Moving element to the foreground
      parentElement.removeChild(this.svgElement);
      parentElement.appendChild(this.svgElement);
    }
    const mouseEvent = <MouseEvent>event;
    this.dragX = mouseEvent.clientX;
    this.dragY = mouseEvent.clientY;
    this.mouseDown = true;
    this.onSelected();
  }

  deleteElement() {
    const parentElement = this.svgElement.parentElement;
    if (!!parentElement) {
      // Moving element to the foreground
      parentElement.removeChild(this.svgElement);
    }
  }

  onMouseMove(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.mouseDown && this.canUserEdit) {
      this.dragOperation = true;
      const dx = mouseEvent.clientX - this.dragX;
      const dy = mouseEvent.clientY - this.dragY;
      this.dragX = mouseEvent.clientX;
      this.dragY = mouseEvent.clientY;
      this.translateX += dx;
      this.translateY += dy;
      this.svgElement.setAttribute(
        'transform',
        `translate(${this.translateX}, ${this.translateY})`
      );
      if (this.anchors.length !== 0) {
        this.anchors.forEach((anchor) => {
          const transform = parseTransformAttribute(
            anchor.getAttribute('transform')!
          );
          const anchorTransform = transform[0];
          const newTranslateX = +anchorTransform.values[0] + dx;
          const newTranslateY = +anchorTransform.values[1] + dy;
          anchor.setAttribute(
            'transform',
            `translate(${newTranslateX}, ${newTranslateY})`
          );
        });
      }
      this.propertiesService.sendPropertiesEventEmmiter.next(
        this.getProperties()
      );
    }
  }

  onMouseUp() {
    this.mouseDown = false;
    if (this.dragOperation) {
      this.propertiesService.sendPropertiesEventEmmiter.next(
        this.getProperties()
      );
      this.endShapeDragEventEmitter.next({
        id: this.svgElement.getAttribute('id')!,
        transform: this.svgElement.getAttribute('transform')!,
      });
      this.dragOperation = false;
    }
  }

  onMouseLeave(event: Event) {
    this.mouseDown = false;

    if (this.dragOperation) {
      this.endShapeDragEventEmitter.next({
        id: this.svgElement.getAttribute('id')!,
        transform: this.svgElement.getAttribute('transform')!,
      });
      this.dragOperation = false;
    }
  }

  onSelected() {
    const id = this.svgElement.getAttribute('id');
    this.propertiesService.sendPropertiesEventEmmiter.next(
      this.getProperties()
    );
    const anchorsCoordinates = this.getAnchorsCoordinates();
    if (!!id) {
      this.createShapeAnchorsEventEmitter.next({
        shapeId: id,
        anchorsCoordinates,
      });
    }
  }

  abstract updateProperties(properties: SvgElementProperties): void;
  abstract getAnchorsCoordinates(): AnchorCoordinates[];
  abstract setAnchors(anchors: HTMLElement[]): void;
  abstract getAnchors(): HTMLElement[];
  abstract getProperties(): SvgElementProperties;

  updateProperty(name: string, value: string) {
    switch (name) {
      case 'x-position':
        if (!!this.svgElement.getAttribute('cx')) {
          this.svgElement.setAttribute('cx', value);
        } else {
          this.svgElement.setAttribute('x', value);
          if (this.anchors.length !== 0) {
            this.createShapeAnchorsEventEmitter.next({
              shapeId: this.svgElement.getAttribute('id')!,
              anchorsCoordinates: this.getAnchorsCoordinates(),
            });
          }
        }
        break;
      case 'y-position':
        if (!!this.svgElement.getAttribute('cy')) {
          this.svgElement.setAttribute('cy', value);
        } else {
          this.svgElement.setAttribute('y', value);
          if (this.anchors.length !== 0) {
            this.createShapeAnchorsEventEmitter.next({
              shapeId: this.svgElement.getAttribute('id')!,
              anchorsCoordinates: this.getAnchorsCoordinates(),
            });
          }
        }
        break;
      case 'height':
        this.svgElement.setAttribute('height', value);

        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            shapeId: this.svgElement.getAttribute('id')!,
            anchorsCoordinates: this.getAnchorsCoordinates(),
          });
        }
        break;
      case 'width':
        this.svgElement.setAttribute('width', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            shapeId: this.svgElement.getAttribute('id')!,
            anchorsCoordinates: this.getAnchorsCoordinates(),
          });
        }
        break;
      case 'radius':
        this.svgElement.setAttribute('r', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            shapeId: this.svgElement.getAttribute('id')!,
            anchorsCoordinates: this.getAnchorsCoordinates(),
          });
        }
        break;
      case 'fill-color':
        this.svgElement.setAttribute('fill', value);
        break;
      case 'stroke-width':
        this.svgElement.setAttribute('stroke-width', value);
        break;
      case 'stroke-color':
        this.svgElement.setAttribute('stroke', value);
        break;
      case 'fill-opacity':
        this.svgElement.setAttribute('fill-opacity', value);
        break;
      case 'path':
        this.svgElement.setAttribute('d', value);
        break;
      case 'text':
        this.svgElement.innerHTML = value;
        break;
      case 'font-size':
        this.svgElement.setAttribute('font-size', value);
        break;
      case 'transform':
        this.svgElement.setAttribute('transform', value);
        const parsedTransform = parseTransformAttribute(value);
        const dX = this.translateX - +parsedTransform[0].values[0];
        const dY = this.translateY - +parsedTransform[0].values[1];
        this.translateX = +parsedTransform[0].values[0];
        this.translateY = +parsedTransform[0].values[1];

        if (this.anchors.length !== 0) {
          this.anchors.forEach((anchor) => {
            const transform = parseTransformAttribute(
              anchor.getAttribute('transform')!
            );
            const anchorTransform = transform[0];
            const newTranslateX = +anchorTransform.values[0] - dX;
            const newTranslateY = +anchorTransform.values[1] - dY;
            anchor.setAttribute(
              'transform',
              `translate(${newTranslateX}, ${newTranslateY})`
            );
          });
        }
        break;
    }
  }
}
