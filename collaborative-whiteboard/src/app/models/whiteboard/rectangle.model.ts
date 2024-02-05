import { PropertiesService } from 'src/app/services/properties/properties.service';
import { Anchor, SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';
import { Shape } from 'src/app/enums/shape.enum';
import { SocketService } from 'src/app/services/socket/socket.service';

export class Rectangle extends SvgObject {
  rectAnchorChange: {
    id: string;
    posName: string;
    posVal: string;
    dimensionName: string;
    dimensionVal: string;
  } | null = null;
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>,
    endShapeDragEventEmitter: Subject<{ id: string; transform: string }>,
    socketService: SocketService
  ) {
    super(
      svgElement,
      propertiesService,
      createShapeAnchorsEventEmitter,
      endShapeDragEventEmitter,
      socketService
    );
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] {
    const x = +this.svgElement.getAttribute('x')!;
    const y = +this.svgElement.getAttribute('y')!;
    const width = +this.svgElement.getAttribute('width')!;
    const height = +this.svgElement.getAttribute('height')!;

    const topAnchor: AnchorCoordinates = {
      x: x + width / 2 + this.translateX - 10,
      y: y + this.translateY - 18,
    };
    const bottomAnchor: AnchorCoordinates = {
      x: x + width / 2 + this.translateX - 10,
      y: y + height + this.translateY - 2,
    };
    const leftAnchor: AnchorCoordinates = {
      x: x + this.translateX - 18,
      y: y + height / 2 + this.translateY - 10,
    };
    const rightAnchor: AnchorCoordinates = {
      x: x + width + this.translateX - 2,
      y: y + height / 2 + this.translateY - 10,
    };
    return [topAnchor, bottomAnchor, leftAnchor, rightAnchor];
  }

  override setAnchors(anchors: HTMLElement[]): void {
    this.anchors = anchors;
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('mousedown', this.onMouseDownAnchor.bind(this));
      anchor.addEventListener('mouseup', this.onMouseUpAnchor.bind(this));
      anchor.addEventListener('mouseleave', this.onMouseLeaveAnchor.bind(this));
    });
    this.anchors[Anchor.TOP].addEventListener(
      'mousemove',
      this.onMouseMoveTopAnchor.bind(this)
    );
    this.anchors[Anchor.BOTTOM].addEventListener(
      'mousemove',
      this.onMouseMoveBottomAnchor.bind(this)
    );
    this.anchors[Anchor.LEFT].addEventListener(
      'mousemove',
      this.onMouseMoveLeftAnchor.bind(this)
    );
    this.anchors[Anchor.RIGHT].addEventListener(
      'mousemove',
      this.onMouseMoveRightAnchor.bind(this)
    );
  }

  override getAnchors(): HTMLElement[] {
    return this.anchors;
  }

  override getProperties(): SvgElementProperties {
    const id = this.svgElement.getAttribute('id')!;
    const x = this.svgElement.getAttribute('x')!;
    const y = this.svgElement.getAttribute('y')!;
    const width = this.svgElement.getAttribute('width')!;
    const height = this.svgElement.getAttribute('height')!;
    const stroke = this.svgElement.getAttribute('stroke')!;
    const strokeWidth = this.svgElement.getAttribute('stroke-width')!;
    const fill = this.svgElement.getAttribute('fill')!;
    const fillOpacity = this.svgElement.getAttribute('fill-opacity')!;
    const transform = this.svgElement.getAttribute('transform')!;

    return {
      id,
      shapeType: Shape.RECTANGLE,
      x: `${+x + this.translateX}`,
      y: `${+y + this.translateY}`,
      width,
      height,
      stroke,
      'stroke-width': strokeWidth,
      fill,
      'fill-opacity': fillOpacity,
      transform,
    };
  }

  onMouseDownAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    this.anchorDragX = mouseEvent.clientX;
    this.anchorDragY = mouseEvent.clientY;
    this.anchorMouseDown = true;
  }

  onMouseUpAnchor() {
    this.propertiesService.sendPropertiesEventEmmiter.next(
      this.getProperties()
    );
    this.anchorMouseDown = false;

    if (!!this.rectAnchorChange) {
      this.socketService.updateWhiteboardElement(
        this.rectAnchorChange.id,
        this.rectAnchorChange.dimensionName,
        this.rectAnchorChange.dimensionVal
      );

      if (this.rectAnchorChange.posName !== '') {
        this.socketService.updateWhiteboardElement(
          this.rectAnchorChange.id,
          this.rectAnchorChange.posName,
          this.rectAnchorChange.posVal
        );
      }
      this.rectAnchorChange = null;
    }
  }

  onMouseLeaveAnchor() {
    this.propertiesService.sendPropertiesEventEmmiter.next(
      this.getProperties()
    );
    this.anchorMouseDown = false;

    if (!!this.rectAnchorChange) {
      this.socketService.updateWhiteboardElement(
        this.rectAnchorChange.id,
        this.rectAnchorChange.dimensionName,
        this.rectAnchorChange.dimensionVal
      );

      if (this.rectAnchorChange.posName !== '') {
        this.socketService.updateWhiteboardElement(
          this.rectAnchorChange.id,
          this.rectAnchorChange.posName,
          this.rectAnchorChange.posVal
        );
      }
      this.rectAnchorChange = null;
    }
  }

  onMouseMoveTopAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const topAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.TOP].getAttribute('transform')!
      );
      const leftAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.LEFT].getAttribute('transform')!
      );
      const rightAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.RIGHT].getAttribute('transform')!
      );

      const topTranslateX = topAnchorTransform[0].values[0];
      const topTranslateY = topAnchorTransform[0].values[1];
      this.anchors[Anchor.TOP].setAttribute(
        'transform',
        `translate(${topTranslateX}, ${+topTranslateY + dy})`
      );

      const leftTranslateX = leftAnchorTransform[0].values[0];
      const leftTranslateY = leftAnchorTransform[0].values[1];
      this.anchors[Anchor.LEFT].setAttribute(
        'transform',
        `translate(${leftTranslateX}, ${+leftTranslateY + dy / 2})`
      );

      const rightTranslateX = rightAnchorTransform[0].values[0];
      const rightTranslateY = rightAnchorTransform[0].values[1];
      this.anchors[Anchor.RIGHT].setAttribute(
        'transform',
        `translate(${rightTranslateX}, ${+rightTranslateY + dy / 2})`
      );
      const id = this.svgElement.getAttribute('id')!;
      const y = this.svgElement.getAttribute('y')!;
      this.svgElement.setAttribute('y', `${+y + dy}`);
      const height = this.svgElement.getAttribute('height')!;
      this.svgElement.setAttribute('height', `${+height - dy}`);

      this.rectAnchorChange = {
        id,
        posName: 'y-position',
        posVal: `${+y + dy}`,
        dimensionName: 'height',
        dimensionVal: `${+height - dy}`,
      };
    }
  }

  onMouseMoveBottomAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const bottomAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.BOTTOM].getAttribute('transform')!
      );
      const leftAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.LEFT].getAttribute('transform')!
      );
      const rightAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.RIGHT].getAttribute('transform')!
      );

      const bottomTranslateX = bottomAnchorTransform[0].values[0];
      const bottomTranslateY = bottomAnchorTransform[0].values[1];
      this.anchors[Anchor.BOTTOM].setAttribute(
        'transform',
        `translate(${bottomTranslateX}, ${+bottomTranslateY + dy})`
      );

      const leftTranslateX = leftAnchorTransform[0].values[0];
      const leftTranslateY = leftAnchorTransform[0].values[1];
      this.anchors[Anchor.LEFT].setAttribute(
        'transform',
        `translate(${leftTranslateX}, ${+leftTranslateY + dy / 2})`
      );

      const rightTranslateX = rightAnchorTransform[0].values[0];
      const rightTranslateY = rightAnchorTransform[0].values[1];
      this.anchors[Anchor.RIGHT].setAttribute(
        'transform',
        `translate(${rightTranslateX}, ${+rightTranslateY + dy / 2})`
      );
      const id = this.svgElement.getAttribute('id')!;
      const height = this.svgElement.getAttribute('height')!;
      this.svgElement.setAttribute('height', `${+height + dy}`);
      this.rectAnchorChange = {
        id,
        posName: '',
        posVal: '',
        dimensionName: 'height',
        dimensionVal: `${+height + dy}`,
      };
    }
  }

  onMouseMoveLeftAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const leftAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.LEFT].getAttribute('transform')!
      );
      const topAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.TOP].getAttribute('transform')!
      );
      const bottomAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.BOTTOM].getAttribute('transform')!
      );

      const leftTranslateX = leftAnchorTransform[0].values[0];
      const leftTranslateY = leftAnchorTransform[0].values[1];
      this.anchors[Anchor.LEFT].setAttribute(
        'transform',
        `translate(${+leftTranslateX + dx}, ${leftTranslateY})`
      );

      const topTranslateX = topAnchorTransform[0].values[0];
      const topTranslateY = topAnchorTransform[0].values[1];
      this.anchors[Anchor.TOP].setAttribute(
        'transform',
        `translate(${+topTranslateX + dx / 2}, ${topTranslateY})`
      );

      const bottomTranslateX = bottomAnchorTransform[0].values[0];
      const bottomTranslateY = bottomAnchorTransform[0].values[1];
      this.anchors[Anchor.BOTTOM].setAttribute(
        'transform',
        `translate(${+bottomTranslateX + dx / 2}, ${bottomTranslateY})`
      );
      const id = this.svgElement.getAttribute('id')!;
      const x = this.svgElement.getAttribute('x')!;
      this.svgElement.setAttribute('x', `${+x + dx}`);
      const width = this.svgElement.getAttribute('width')!;
      this.svgElement.setAttribute('width', `${+width - dx}`);

      this.rectAnchorChange = {
        id,
        posName: 'x-position',
        posVal: `${+x + dx}`,
        dimensionName: 'width',
        dimensionVal: `${+width - dx}`,
      };
    }
  }

  onMouseMoveRightAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      const rightAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.RIGHT].getAttribute('transform')!
      );
      const topAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.TOP].getAttribute('transform')!
      );
      const bottomAnchorTransform = parseTransformAttribute(
        this.anchors[Anchor.BOTTOM].getAttribute('transform')!
      );

      const rightTranslateX = rightAnchorTransform[0].values[0];
      const rightTranslateY = rightAnchorTransform[0].values[1];
      this.anchors[Anchor.RIGHT].setAttribute(
        'transform',
        `translate(${+rightTranslateX + dx}, ${rightTranslateY})`
      );

      const topTranslateX = topAnchorTransform[0].values[0];
      const topTranslateY = topAnchorTransform[0].values[1];
      this.anchors[Anchor.TOP].setAttribute(
        'transform',
        `translate(${+topTranslateX + dx / 2}, ${topTranslateY})`
      );

      const bottomTranslateX = bottomAnchorTransform[0].values[0];
      const bottomTranslateY = bottomAnchorTransform[0].values[1];
      this.anchors[Anchor.BOTTOM].setAttribute(
        'transform',
        `translate(${+bottomTranslateX + dx / 2}, ${bottomTranslateY})`
      );
      const id = this.svgElement.getAttribute('id')!;
      const width = this.svgElement.getAttribute('width')!;
      this.svgElement.setAttribute('width', `${+width + dx}`);
      this.rectAnchorChange = {
        id,
        posName: '',
        posVal: '',
        dimensionName: 'width',
        dimensionVal: `${+width + dx}`,
      };
    }
  }

  override updateProperties(properties: SvgElementProperties): void {
    if (this.canUserEdit) {
      const x = +this.svgElement.getAttribute('x')!;
      const y = +this.svgElement.getAttribute('y')!;
      this.translateX = +properties.x! - x;
      this.translateY = +properties.y! - y;
      this.svgElement.setAttribute(
        'transform',
        `translate(${this.translateX}, ${this.translateY})`
      );
      this.svgElement.setAttribute('width', properties.width!);
      this.svgElement.setAttribute('height', properties.height!);
      this.svgElement.setAttribute('stroke', properties.stroke!);
      this.svgElement.setAttribute('stroke-width', properties['stroke-width']!);
      this.svgElement.setAttribute('fill', properties.fill!);
      this.svgElement.setAttribute('fill-opacity', properties['fill-opacity']!);
      this.createShapeAnchorsEventEmitter.next({
        shapeId: properties.id,
        anchorsCoordinates: this.getAnchorsCoordinates(),
      });
    }
  }
}
