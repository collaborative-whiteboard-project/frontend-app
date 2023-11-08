import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';

export class Rectangle extends SvgObject {
  constructor(svgElement: HTMLElement, propertiesService: PropertiesService) {
    super(svgElement, propertiesService);
  }
}
