import { Injectable } from '@angular/core';
import { SvgObject } from '../models/svg-object.model';

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
    if ((<MouseEvent>event).button === LEFT_MOUSE_BUTTON) {
      event.preventDefault();
      const target = event.currentTarget;

      if (!target) {
        return;
      }

      const id = (<HTMLElement>target).getAttribute('id');

      if (!id) {
        return;
      }

      this.activeController = this.controllers[id];
      this.mouseDown = true;
      this.mouseDownX = (<MouseEvent>event).clientX;
      this.mouseDownY = (<MouseEvent>event).clientY;
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
