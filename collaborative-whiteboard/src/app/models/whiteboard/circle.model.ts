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

enum ResizeType {
  REDUCE_RADIUS = 'reduce_radius',
  INCREASE_RADIUS = 'increase_radius',
}

export class Circle extends SvgObject {
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
    const cx = +this.svgElement.getAttribute('cx')!;
    const cy = +this.svgElement.getAttribute('cy')!;
    const r = +this.svgElement.getAttribute('r')!;

    const topAnchor: AnchorCoordinates = {
      x: cx + this.translateX - 10,
      y: cy + this.translateY - r - 18,
    };
    const bottomAnchor: AnchorCoordinates = {
      x: cx + this.translateX - 10,
      y: cy + this.translateY + r - 2,
    };
    const leftAnchor: AnchorCoordinates = {
      x: cx + this.translateX - r - 18,
      y: cy + this.translateY - 10,
    };
    const rightAnchor: AnchorCoordinates = {
      x: cx + this.translateX + r - 2,
      y: cy + this.translateY - 10,
    };
    return [topAnchor, bottomAnchor, leftAnchor, rightAnchor];
  }

  override getProperties(): SvgElementProperties {
    const id = this.svgElement.getAttribute('id')!;
    const cx = this.svgElement.getAttribute('cx')!;
    const cy = this.svgElement.getAttribute('cy')!;
    const r = this.svgElement.getAttribute('r')!;
    const stroke = this.svgElement.getAttribute('stroke')!;
    const strokeWidth = this.svgElement.getAttribute('stroke-width')!;
    const fill = this.svgElement.getAttribute('fill')!;
    const fillOpacity = this.svgElement.getAttribute('fill-opacity')!;
    const transform = this.svgElement.getAttribute('transform')!;

    return {
      id,
      shapeType: Shape.CIRCLE,
      x: `${+cx + this.translateX}`,
      y: `${+cy + this.translateY}`,
      r,
      stroke,
      'stroke-width': strokeWidth,
      fill,
      'fill-opacity': fillOpacity,
      transform,
    };
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
  }

  onMouseLeaveAnchor() {
    this.propertiesService.sendPropertiesEventEmmiter.next(
      this.getProperties()
    );
    this.anchorMouseDown = false;
  }

  onMouseMoveTopAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      if (dy < 0) {
        this.resizeCircle(Math.abs(dy), ResizeType.INCREASE_RADIUS);
      } else if (dy > 0) {
        this.resizeCircle(Math.abs(dy), ResizeType.REDUCE_RADIUS);
      }
    }
  }

  onMouseMoveBottomAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dy = mouseEvent.clientY - this.anchorDragY;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      if (dy < 0) {
        this.resizeCircle(Math.abs(dy), ResizeType.REDUCE_RADIUS);
      } else if (dy > 0) {
        this.resizeCircle(Math.abs(dy), ResizeType.INCREASE_RADIUS);
      }
    }
  }

  onMouseMoveLeftAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      if (dx < 0) {
        this.resizeCircle(Math.abs(dx), ResizeType.INCREASE_RADIUS);
      } else if (dx > 0) {
        this.resizeCircle(Math.abs(dx), ResizeType.REDUCE_RADIUS);
      }
    }
  }

  onMouseMoveRightAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown && this.canUserEdit) {
      const dx = mouseEvent.clientX - this.anchorDragX;
      this.anchorDragX = mouseEvent.clientX;
      this.anchorDragY = mouseEvent.clientY;

      if (dx < 0) {
        this.resizeCircle(Math.abs(dx), ResizeType.REDUCE_RADIUS);
      } else if (dx > 0) {
        this.resizeCircle(Math.abs(dx), ResizeType.INCREASE_RADIUS);
      }
    }
  }

  override updateProperties(properties: SvgElementProperties): void {
    if (this.canUserEdit) {
      const x = +this.svgElement.getAttribute('cx')!;
      const y = +this.svgElement.getAttribute('cy')!;
      this.translateX = +properties.x! - x;
      this.translateY = +properties.y! - y;
      this.svgElement.setAttribute(
        'transform',
        `translate(${this.translateX}, ${this.translateY})`
      );
      this.svgElement.setAttribute('r', properties.r!);
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

  private resizeCircle(amount: number, resizeType: ResizeType) {
    const directionCoefficient =
      resizeType === ResizeType.INCREASE_RADIUS ? 1 : -1;
    const topAnchorTransform = parseTransformAttribute(
      this.anchors[Anchor.TOP].getAttribute('transform')!
    );
    const bottomAnchorTransform = parseTransformAttribute(
      this.anchors[Anchor.BOTTOM].getAttribute('transform')!
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
      `translate(${topTranslateX}, ${
        +topTranslateY - +amount * directionCoefficient
      })`
    );

    const bottomTranslateX = bottomAnchorTransform[0].values[0];
    const bottomTranslateY = bottomAnchorTransform[0].values[1];
    this.anchors[Anchor.BOTTOM].setAttribute(
      'transform',
      `translate(${bottomTranslateX}, ${
        +bottomTranslateY + +amount * directionCoefficient
      })`
    );

    const leftTranslateX = leftAnchorTransform[0].values[0];
    const leftTranslateY = leftAnchorTransform[0].values[1];
    this.anchors[Anchor.LEFT].setAttribute(
      'transform',
      `translate(${
        +leftTranslateX - +amount * directionCoefficient
      }, ${leftTranslateY})`
    );

    const rightTranslateX = rightAnchorTransform[0].values[0];
    const rightTranslateY = rightAnchorTransform[0].values[1];
    this.anchors[Anchor.RIGHT].setAttribute(
      'transform',
      `translate(${
        +rightTranslateX + +amount * directionCoefficient
      }, ${+rightTranslateY})`
    );

    const r = this.svgElement.getAttribute('r')!;
    this.svgElement.setAttribute('r', `${+r + amount * directionCoefficient}`);
  }
}
