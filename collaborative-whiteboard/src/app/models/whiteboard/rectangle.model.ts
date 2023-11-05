import { PropertiesService } from 'src/app/services/properties/properties.service';
import { MouseService } from '../../services/whiteboard/mouse.service';
import { SvgElement } from './svg-element.model';
import { Shape } from 'src/app/enums/shape.enum';

export class Rectangle extends SvgElement {
  constructor(
    mouseController: MouseService,
    svgElement: HTMLElement,
    propertiesService: PropertiesService
  ) {
    super(mouseController, svgElement, propertiesService);
  }
}
