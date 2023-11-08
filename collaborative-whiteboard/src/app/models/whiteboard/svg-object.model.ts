import { PropertiesService } from 'src/app/services/properties/properties.service';

export class SvgObject {
  mouseDown = false;
  dragX = 0;
  dragY = 0;
  translateX = 0;
  translateY = 0;
  constructor(
    protected svgElement: HTMLElement,
    protected propertiesService: PropertiesService
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
    }
  }

  onMouseUp() {
    this.mouseDown = false;
  }

  onMouseLeave(event: Event) {
    this.mouseDown = false;
  }

  onSelected() {
    const id = this.svgElement.getAttribute('id');
    const stroke = this.svgElement.getAttribute('stroke');
    const strokeWidth = this.svgElement.getAttribute('stroke-width');
    const fill = this.svgElement.getAttribute('fill');
    if (!!id && !!stroke && !!strokeWidth && !!fill) {
      this.propertiesService.sendPropertiesEventEmmiter.next({
        id,
        stroke,
        'stroke-width': strokeWidth,
        fill,
      });
    }
  }
}
