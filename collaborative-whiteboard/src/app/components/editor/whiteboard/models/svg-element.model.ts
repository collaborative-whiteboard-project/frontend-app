import { MouseService } from '../services/mouse.service';
import { SvgObject } from './svg-object.model';

export class SvgElement extends SvgObject {
  constructor(
    mouseController: MouseService,
    protected svgElement: HTMLElement
  ) {
    super(mouseController, svgElement);
    this.registerEventListener(
      {
        element: this.svgElement,
        eventName: 'mousedown',
        callbackRef: mouseController.onMouseDown,
      },
      mouseController
    );
    this.registerEventListener(
      {
        element: this.svgElement,
        eventName: 'mouseup',
        callbackRef: mouseController.onMouseUp,
      },
      mouseController
    );
    this.registerEventListener(
      {
        element: this.svgElement,
        eventName: 'mousemove',
        callbackRef: mouseController.onMouseMove,
      },
      mouseController
    );

    this.registerEventListener(
      {
        element: this.svgElement,
        eventName: 'mouseleave',
        callbackRef: mouseController.onMouseLeave,
      },
      mouseController
    );
  }

  override onDrag(event: Event): void {
    this.updatePosition(event);
    this.svgElement.setAttribute(
      'transform',
      'translate(' + this.x + ',' + this.y + ')'
    );
  }
  override onMouseLeave(event: Event): void {
    this.onDrag(event);
  }
}
