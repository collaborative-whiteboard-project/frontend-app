import { Injectable } from '@angular/core';
import { SvgObject } from '../../models/whiteboard/svg-object.model';

const LEFT_MOUSE_BUTTON = 0;

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  mouseDown = false;
  mouseDownX: number = 0;
  mouseDownY: number = 0;
  controllers: { [svgElementId: string]: SvgObject } = {};
  activeController: SvgObject | null = null;

  constructor() {}

  attach(svgElement: HTMLElement, controller: SvgObject) {
    const id = svgElement.getAttribute('id');
    if (id) {
      this.controllers[id] = controller;
    }
  }

  detach(svgElement: HTMLElement) {
    const id = svgElement.getAttribute('id');
    if (id) {
      delete this.controllers[id];
    }
  }

  onMouseDown(event: Event) {
    const mouseEvent = <MouseEvent>event;
    if (mouseEvent.button === LEFT_MOUSE_BUTTON) {
      event.preventDefault();
      const target = <HTMLElement>event.currentTarget;

      if (!target) {
        return;
      }

      const id = target.getAttribute('id');

      if (!id) {
        return;
      }

      this.activeController = this.controllers[id];
      this.mouseDown = true;
      this.mouseDownX = mouseEvent.clientX;
      this.mouseDownY = mouseEvent.clientY;

      this.activeController.onSelected();
    }
  }

  onMouseMove(event: Event) {
    event.preventDefault();

    if (this.mouseDown && this.activeController != null) {
      this.activeController.onDrag(event);
    }
  }

  onMouseUp(event: Event) {
    if ((<MouseEvent>event).button === LEFT_MOUSE_BUTTON) {
      event.preventDefault();
      this.clearSelectedObject();
    }
  }

  onMouseLeave(event: Event) {
    event.preventDefault();
    if (this.mouseDown && this.activeController != null) {
      this.activeController.onMouseLeave(event);
    }
  }

  clearSelectedObject() {
    this.mouseDown = false;
    this.activeController = null;
  }
}
