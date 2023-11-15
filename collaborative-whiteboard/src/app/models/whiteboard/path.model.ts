import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';

export class Path extends SvgObject {
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>
  ) {
    super(svgElement, propertiesService, createShapeAnchorsEventEmitter);
  }

  override setAnchors(anchors: HTMLElement[]): void {
    return;
  }
  override getAnchors(): HTMLElement[] {
    return [];
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] {
    return [];
  }
}
