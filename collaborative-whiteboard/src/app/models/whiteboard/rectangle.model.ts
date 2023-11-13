import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';

export class Rectangle extends SvgObject {
  override setAnchors(anchors: HTMLElement[]): void {
    throw new Error('Method not implemented.');
  }
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>
  ) {
    super(svgElement, propertiesService, createShapeAnchorsEventEmitter);
  }

  override getAnchors(): HTMLElement[] {
    throw new Error('Method not implemented.');
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] | null {
    return null;
  }
}
