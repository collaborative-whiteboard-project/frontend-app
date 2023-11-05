import { PropertiesService } from 'src/app/services/properties/properties.service';
import { MouseService } from '../../services/whiteboard/mouse.service';
import { SvgElement } from './svg-element.model';

export class Circle extends SvgElement {
  constructor(
    mouseController: MouseService,
    svgElement: HTMLElement,
    propertiesService: PropertiesService
  ) {
    super(mouseController, svgElement, propertiesService);
  }
}
