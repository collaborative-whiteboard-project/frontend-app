import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';
import { Shape } from 'src/app/enums/shape.enum';

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

  override getProperties(): SvgElementProperties {
    const id = this.svgElement.getAttribute('id')!;
    const stroke = this.svgElement.getAttribute('stroke')!;
    const strokeWidth = this.svgElement.getAttribute('stroke-width')!;
    const fill = this.svgElement.getAttribute('fill')!;
    const fillOpacity = this.svgElement.getAttribute('fill-opacity')!;

    return {
      id,
      shapeType: Shape.PATH,
      stroke,
      'stroke-width': strokeWidth,
      fill,
      'fill-opacity': fillOpacity,
    };
  }

  override updateProperties(properties: SvgElementProperties): void {
    this.svgElement.setAttribute('stroke', properties.stroke!);
    this.svgElement.setAttribute('stroke-width', properties['stroke-width']!);
    this.svgElement.setAttribute('fill', properties.fill!);
    this.svgElement.setAttribute('fill-opacity', properties['fill-opacity']!);
  }
}
