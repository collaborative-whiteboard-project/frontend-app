import { PropertiesService } from 'src/app/services/properties/properties.service';
import { Anchor, SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';

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
    });
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('mouseup', this.onMouseUpAnchor.bind(this));
    });
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('mouseleave', this.onMouseLeaveAnchor.bind(this));
    });
    this.anchors[0].addEventListener(
      'mousemove',
      this.onMouseMoveTopAnchor.bind(this)
    );
    this.anchors[1].addEventListener(
      'mousemove',
      this.onMouseMoveTopAnchor.bind(this)
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
        `translate(${topTranslateX}, ${+topTranslateY + +dy})`
      );

      const bottomTranslateX = bottomAnchorTransform[0].values[0];
      const bottomTranslateY = bottomAnchorTransform[0].values[1];
      this.anchors[Anchor.BOTTOM].setAttribute(
        'transform',
        `translate(${bottomTranslateX}, ${+bottomTranslateY - +dy})`
      );

      const leftTranslateX = leftAnchorTransform[0].values[0];
      const leftTranslateY = leftAnchorTransform[0].values[1];
      this.anchors[Anchor.LEFT].setAttribute(
        'transform',
        `translate(${+leftTranslateX + +dy}, ${leftTranslateY})`
      );

      const rightTranslateX = rightAnchorTransform[0].values[0];
      const rightTranslateY = rightAnchorTransform[0].values[1];
      this.anchors[Anchor.RIGHT].setAttribute(
        'transform',
        `translate(${+rightTranslateX - +dy}, ${+rightTranslateY})`
      );

      const r = this.svgElement.getAttribute('r')!;
      this.svgElement.setAttribute('r', `${+r - dy}`);
    }
  }
}
