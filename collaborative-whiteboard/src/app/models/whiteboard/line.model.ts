import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { Subject } from 'rxjs';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';
import { Shape } from 'src/app/enums/shape.enum';
import { SocketService } from 'src/app/services/socket/socket.service';

export class Line extends SvgObject {
  anchor1Change: { x: string; y: string } | null = null;
  anchor2Change: { x: string; y: string } | null = null;
  constructor(
    private svgLine: HTMLElement,
    svgLineWrapper: HTMLElement,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>,
    propertiesService: PropertiesService,
    endShapeDragEventEmitter: Subject<{ id: string; transform: string }>,
    socketService: SocketService
  ) {
    const x1 = svgLine.getAttribute('x1')!;
    const y1 = svgLine.getAttribute('y1')!;
    const x2 = svgLine.getAttribute('x2')!;
    const y2 = svgLine.getAttribute('y2')!;
    svgLineWrapper.setAttribute('x1', x1);
    svgLineWrapper.setAttribute('y1', y1);
    svgLineWrapper.setAttribute('x2', x2);
    svgLineWrapper.setAttribute('y2', y2);
    const transform = svgLine.getAttribute('transform');
    if (!!transform) {
      svgLineWrapper.setAttribute('transform', transform);
    }
    super(
      svgLineWrapper,
      propertiesService,
      createShapeAnchorsEventEmitter,
      endShapeDragEventEmitter,
      socketService
    );
  }

  override deleteElement(): void {
    const parentElement = this.svgElement.parentElement;
    const lineParent = this.svgLine.parentElement;
    if (!!parentElement && !!lineParent) {
      // Moving element to the foreground
      parentElement.removeChild(this.svgElement);
      lineParent.removeChild(this.svgLine);
    }
  }

  override onMouseDown(event: Event) {
    const parentElement = this.svgLine.parentElement;
    if (!!parentElement) {
      // Moving element to the foreground
      parentElement.removeChild(this.svgLine);
      parentElement.appendChild(this.svgLine);
    }
    const mouseEvent = <MouseEvent>event;
    this.dragX = mouseEvent.clientX;
    this.dragY = mouseEvent.clientY;
    this.mouseDown = true;
    this.onSelected();
  }

  override onMouseMove(event: Event): void {
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
      this.svgLine.setAttribute(
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
    }
  }

  override onMouseUp() {
    this.mouseDown = false;
    if (this.dragOperation) {
      this.propertiesService.sendPropertiesEventEmmiter.next(
        this.getProperties()
      );
      this.endShapeDragEventEmitter.next({
        id: this.svgLine.getAttribute('id')!,
        transform: this.svgElement.getAttribute('transform')!,
      });
      this.dragOperation = false;
    }
  }

  override onMouseLeave(event: Event) {
    this.mouseDown = false;

    if (this.dragOperation) {
      this.endShapeDragEventEmitter.next({
        id: this.svgLine.getAttribute('id')!,
        transform: this.svgElement.getAttribute('transform')!,
      });
      this.dragOperation = false;
    }
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] {
    const x1 = +this.svgLine.getAttribute('x1')!;
    const y1 = +this.svgLine.getAttribute('y1')!;
    const x2 = +this.svgLine.getAttribute('x2')!;
    const y2 = +this.svgLine.getAttribute('y2')!;

    const firstAnchor: AnchorCoordinates = {
      x: x1 + this.translateX - 10,
      y: y1 + this.translateY - 10,
    };
    const secondAnchor: AnchorCoordinates = {
      x: x2 + this.translateX - 10,
      y: y2 + this.translateY - 10,
    };

    return [firstAnchor, secondAnchor];
  }
  override setAnchors(anchors: HTMLElement[]): void {
    this.anchors = anchors;
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('mousedown', this.onMouseDownAnchor.bind(this));
      anchor.addEventListener('mouseleave', this.onMouseLeaveAnchor.bind(this));
      anchor.addEventListener('mouseup', this.onMouseUpAnchor.bind(this));
    });
    this.anchors[0].addEventListener(
      'mousemove',
      this.onMouseMoveFirstAnchor.bind(this)
    );
    this.anchors[1].addEventListener(
      'mousemove',
      this.onMouseMoveSecondAnchor.bind(this)
    );
  }

  onMouseDownAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    this.anchorDragX = mouseEvent.clientX;
    this.anchorDragY = mouseEvent.clientY;
    this.anchorMouseDown = true;
  }

  onMouseUpAnchor() {
    this.anchorMouseDown = false;
    const id = this.svgLine.getAttribute('id')!;
    if (!!this.anchor1Change) {
      this.socketService.updateWhiteboardElement(
        id,
        'x1-position',
        this.anchor1Change.x
      );
      this.socketService.updateWhiteboardElement(
        id,
        'y1-position',
        this.anchor1Change.y
      );
      this.anchor1Change = null;
    }

    if (!!this.anchor2Change) {
      this.socketService.updateWhiteboardElement(
        id,
        'x2-position',
        this.anchor2Change.x
      );
      this.socketService.updateWhiteboardElement(
        id,
        'y2-position',
        this.anchor2Change.y
      );
      this.anchor2Change = null;
    }
  }

  onMouseLeaveAnchor() {
    this.anchorMouseDown = false;
    const id = this.svgLine.getAttribute('id')!;
    if (!!this.anchor1Change) {
      this.socketService.updateWhiteboardElement(
        id,
        'x1-position',
        this.anchor1Change.x
      );
      this.socketService.updateWhiteboardElement(
        id,
        'y1-position',
        this.anchor1Change.y
      );
      this.anchor1Change = null;
    }

    if (!!this.anchor2Change) {
      this.socketService.updateWhiteboardElement(
        id,
        'x2-position',
        this.anchor2Change.x
      );
      this.socketService.updateWhiteboardElement(
        id,
        'y2-position',
        this.anchor2Change.y
      );
      this.anchor2Change = null;
    }
  }

  onMouseMoveFirstAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const anchorTransform = parseTransformAttribute(
        this.anchors[0].getAttribute('transform')!
      );

      const anchorTranslateX = anchorTransform[0].values[0];
      const anchorTranslateY = anchorTransform[0].values[1];

      this.anchors[0].setAttribute(
        'transform',
        `translate(${+anchorTranslateX + dx}, ${+anchorTranslateY + dy})`
      );

      const x1 = this.svgLine.getAttribute('x1')!;
      const y1 = this.svgLine.getAttribute('y1')!;
      this.svgLine.setAttribute('x1', `${+x1 + dx}`);
      this.svgLine.setAttribute('y1', `${+y1 + dy}`);
      this.svgElement.setAttribute('x1', `${+x1 + dx}`);
      this.svgElement.setAttribute('y1', `${+y1 + dy}`);
      this.anchor1Change = { x: `${+x1 + dx}`, y: `${+y1 + dy}` };
      this.anchor2Change = null;
    }
  }

  onMouseMoveSecondAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const anchorTransform = parseTransformAttribute(
        this.anchors[1].getAttribute('transform')!
      );

      const anchorTranslateX = anchorTransform[0].values[0];
      const anchorTranslateY = anchorTransform[0].values[1];

      this.anchors[1].setAttribute(
        'transform',
        `translate(${+anchorTranslateX + dx}, ${+anchorTranslateY + dy})`
      );

      const x1 = this.svgLine.getAttribute('x2')!;
      const y1 = this.svgLine.getAttribute('y2')!;
      this.svgLine.setAttribute('x2', `${+x1 + dx}`);
      this.svgLine.setAttribute('y2', `${+y1 + dy}`);
      this.svgElement.setAttribute('x2', `${+x1 + dx}`);
      this.svgElement.setAttribute('y2', `${+y1 + dy}`);

      this.anchor2Change = { x: `${+x1 + dx}`, y: `${+y1 + dy}` };
      this.anchor1Change = null;
    }
  }

  override getAnchors(): HTMLElement[] {
    return this.anchors;
  }

  override onSelected() {
    const id = this.svgLine.getAttribute('id');
    const stroke = this.svgElement.getAttribute('stroke');
    const strokeWidth = this.svgElement.getAttribute('stroke-width');
    const fill = this.svgElement.getAttribute('fill');
    const fillOpacity = this.svgElement.getAttribute('fill-opacity');
    if (!!id && !!stroke && !!strokeWidth && !!fill && !!fillOpacity) {
    }
    const anchorsCoordinates = this.getAnchorsCoordinates();
    if (!!id) {
      this.createShapeAnchorsEventEmitter.next({
        shapeId: id,
        anchorsCoordinates,
      });
    }
  }

  getWrapperElement() {
    return this.svgElement;
  }

  override getProperties(): SvgElementProperties {
    const id = this.svgLine.getAttribute('id')!;
    const stroke = this.svgLine.getAttribute('stroke')!;
    const strokeWidth = this.svgLine.getAttribute('stroke-width')!;
    const transform = this.svgLine.getAttribute('transform')!;

    return {
      id,
      shapeType: Shape.LINE,
      stroke,
      'stroke-width': strokeWidth,
      transform,
    };
  }

  override updateProperties(properties: SvgElementProperties): void {
    if (this.canUserEdit) {
      this.svgLine.setAttribute('stroke', properties.stroke!);
      this.svgLine.setAttribute('stroke-width', properties['stroke-width']!);
    }
  }

  override updateProperty(name: string, value: string): void {
    const id = this.svgLine.getAttribute('id')!;
    switch (name) {
      case 'x1-position':
        this.svgElement.setAttribute('x1', value);
        this.svgLine.setAttribute('x1', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            anchorsCoordinates: this.getAnchorsCoordinates(),
            shapeId: id,
          });
        }
        break;
      case 'y1-position':
        this.svgElement.setAttribute('y1', value);
        this.svgLine.setAttribute('y1', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            anchorsCoordinates: this.getAnchorsCoordinates(),
            shapeId: id,
          });
        }
        break;
      case 'x2-position':
        this.svgElement.setAttribute('x2', value);
        this.svgLine.setAttribute('x2', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            anchorsCoordinates: this.getAnchorsCoordinates(),
            shapeId: id,
          });
        }
        break;
      case 'y2-position':
        this.svgElement.setAttribute('y2', value);
        this.svgLine.setAttribute('y2', value);
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            anchorsCoordinates: this.getAnchorsCoordinates(),
            shapeId: id,
          });
        }
        break;
      case 'stroke-width':
        this.svgLine.setAttribute('stroke-width', value);
        break;
      case 'stroke-color':
        this.svgLine.setAttribute('stroke', value);
        break;
      case 'transform':
        this.svgElement.setAttribute('transform', value);
        this.svgLine.setAttribute('transform', value);
        const parsedTransform = parseTransformAttribute(value);
        this.translateX = +parsedTransform[0].values[0];
        this.translateY = +parsedTransform[0].values[1];
        if (this.anchors.length !== 0) {
          this.createShapeAnchorsEventEmitter.next({
            anchorsCoordinates: this.getAnchorsCoordinates(),
            shapeId: id,
          });
        }
        break;
    }
  }
}
