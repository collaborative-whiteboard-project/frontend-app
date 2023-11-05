import { PropertiesService } from 'src/app/services/properties/properties.service';
import { MouseService } from '../../services/whiteboard/mouse.service';
import { SvgObject } from './svg-object.model';

export class SvgElement extends SvgObject {
  constructor(
    mouseController: MouseService,
    svgElement: HTMLElement,
    protected propertiesService: PropertiesService
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

  onSelected() {
    const id = this.svgElement.getAttribute('id');
    const stroke = this.svgElement.getAttribute('stroke');
    const strokeWidth = this.svgElement.getAttribute('stroke-width');
    const fill = this.svgElement.getAttribute('fill');

    if (!!id && !!stroke && !!strokeWidth && fill) {
      this.propertiesService.sendPropertiesEventEmmiter.next({
        id,
        stroke,
        'stroke-width': strokeWidth,
        fill,
      });
    }
  }
}
