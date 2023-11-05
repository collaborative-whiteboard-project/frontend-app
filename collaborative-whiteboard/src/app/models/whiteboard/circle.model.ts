import { MouseService } from '../../services/whiteboard/mouse.service';
import { SvgElement } from './svg-element.model';

export class Circle extends SvgElement {
  constructor(mouseController: MouseService, svgElement: HTMLElement) {
    super(mouseController, svgElement);
  }
}
