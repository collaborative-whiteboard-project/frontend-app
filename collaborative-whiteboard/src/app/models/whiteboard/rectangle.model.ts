import { PropertiesService } from 'src/app/services/properties/properties.service';
import { Anchor, SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';

export class Rectangle extends SvgObject {
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>
  ) {
    super(svgElement, propertiesService, createShapeAnchorsEventEmitter);
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] | null {
    const x = +this.svgElement.getAttribute('x')!;
    const y = +this.svgElement.getAttribute('y')!;
    const width = +this.svgElement.getAttribute('width')!;
    const height = +this.svgElement.getAttribute('height')!;

    const topAnchor: AnchorCoordinates = {
      x: x + width / 2 + this.translateX - 8,
      y: y + this.translateY - 14,
    };
    const bottomAnchor: AnchorCoordinates = {
      x: x + width / 2 + this.translateX - 8,
      y: y + height + this.translateY - 2,
    };
    const leftAnchor: AnchorCoordinates = {
      x: x + this.translateX - 14,
      y: y + height / 2 + this.translateY - 8,
    };
    const rightAnchor: AnchorCoordinates = {
      x: x + width + this.translateX - 2,
      y: y + height / 2 + this.translateY - 8,
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
      const y = this.svgElement.getAttribute('y')!;
      this.svgElement.setAttribute('y', `${+y + dy}`);
      const height = this.svgElement.getAttribute('height')!;
      this.svgElement.setAttribute('height', `${+height - dy}`);
    }
  }

  onMouseMoveBottomAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown) {
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
      const height = this.svgElement.getAttribute('height')!;
      this.svgElement.setAttribute('height', `${+height + dy}`);
    }
  }

  onMouseMoveLeftAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown) {
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
      const x = this.svgElement.getAttribute('x')!;
      this.svgElement.setAttribute('x', `${+x + dx}`);
      const width = this.svgElement.getAttribute('width')!;
      this.svgElement.setAttribute('width', `${+width - dx}`);
    }
  }

  onMouseMoveRightAnchor(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (this.anchorMouseDown) {
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
      const width = this.svgElement.getAttribute('width')!;
      this.svgElement.setAttribute('width', `${+width + dx}`);
    }
  }
}
