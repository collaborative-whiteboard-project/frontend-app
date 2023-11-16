import { Subject } from 'rxjs';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';
import { PropertiesService } from 'src/app/services/properties/properties.service';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';

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
  anchors: HTMLElement[] = [];
  constructor(
    protected svgElement: HTMLElement,
    protected propertiesService: PropertiesService,
    protected createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>
  ) {
    this.svgElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.svgElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.svgElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.svgElement.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );
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

  onMouseMove(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.mouseDown) {
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
    this.propertiesService.sendPropertiesEventEmmiter.next(
      this.getProperties()
    );
    this.mouseDown = false;
  }

  onMouseLeave(event: Event) {
    this.mouseDown = false;
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
}
