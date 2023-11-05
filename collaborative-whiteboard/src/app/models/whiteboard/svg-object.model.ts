import { MouseService } from '../../services/whiteboard/mouse.service';
interface SvgEvent {
  element: HTMLElement;
  eventName: string;
  callbackRef: (event: Event) => void;
}

export abstract class SvgObject {
  x: number = 0;
  y: number = 0;
  dragX: number = 0;
  dragY: number = 0;
  events: SvgEvent[] = [];

  constructor(
    protected mouseController: MouseService,
    svgElement: HTMLElement
  ) {
    this.mouseController.attach(svgElement, this);
  }

  registerEvent(svgEvent: SvgEvent) {
    this.events.push(svgEvent);
  }

  registerEventListener(
    { element, eventName, callbackRef }: SvgEvent,
    invoker: MouseService | null
  ) {
    let ref: (event: Event) => void;
    element.addEventListener(
      eventName,
      (ref = callbackRef.bind(!!invoker ? invoker : this))
    );
    this.registerEvent({ element, eventName, callbackRef: ref });
  }

  unhookEvents() {
    for (let event of this.events) {
      event.element.removeEventListener(event.eventName, event.callbackRef);
    }

    this.events = [];
  }

  startMove() {
    this.dragX = 0;
    this.dragY = 0;
  }

  updatePosition(event: Event) {
    const mouseEvent = <MouseEvent>event;
    const mouseX = mouseEvent.clientX;
    const mouseY = mouseEvent.clientY;
    const mouseDX = mouseX - this.mouseController.mouseDownX;
    const mouseDY = mouseY - this.mouseController.mouseDownY;
    this.x += mouseDX;
    this.y += mouseDY;
    this.mouseController.mouseDownX = mouseX;
    this.mouseController.mouseDownY = mouseY;
  }

  abstract onDrag(event: Event): void;
  abstract onMouseLeave(event: Event): void;
}
