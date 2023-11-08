import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';

export class Path extends SvgObject {
  constructor(svgElement: HTMLElement, propertiesService: PropertiesService) {
    super(svgElement, propertiesService);
  }
}
