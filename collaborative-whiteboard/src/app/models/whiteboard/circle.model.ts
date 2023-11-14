import { PropertiesService } from 'src/app/services/properties/properties.service';
import { Anchor, SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';

enum ResizeType {
  REDUCE_RADIUS = 'reduce_radius',
  INCREASE_RADIUS = 'increase_radius',
}

export class Circle extends SvgObject {
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>
  ) {
    super(svgElement, propertiesService, createShapeAnchorsEventEmitter);
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] | null {
    const cx = +this.svgElement.getAttribute('cx')!;
    const cy = +this.svgElement.getAttribute('cy')!;
    const r = +this.svgElement.getAttribute('r')!;

    const topAnchor: AnchorCoordinates = {
      x: cx + this.translateX - 8,
      y: cy + this.translateY - r - 14,
    };
    const bottomAnchor: AnchorCoordinates = {
      x: cx + this.translateX - 8,
      y: cy + this.translateY + r - 2,
    };
    const leftAnchor: AnchorCoordinates = {
      x: cx + this.translateX - r - 14,
      y: cy + this.translateY - 8,
    };
    const rightAnchor: AnchorCoordinates = {
      x: cx + this.translateX + r - 2,
      y: cy + this.translateY - 8,
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

  onMouseDownAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    this.anchorDragX = mouseEvent.clientX;
    this.anchorDragY = mouseEvent.clientY;
    this.anchorMouseDown = true;
  }

  onMouseUpAnchor() {
    this.anchorMouseDown = false;
  }

  onMouseLeaveAnchor() {
    this.anchorMouseDown = false;
  }

  onMouseMoveTopAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown) {
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
    if (this.anchorMouseDown) {
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
    if (this.anchorMouseDown) {
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
    if (this.anchorMouseDown) {
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
