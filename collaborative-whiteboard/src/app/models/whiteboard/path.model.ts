import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SvgObject } from './svg-object.model';
import { Subject } from 'rxjs';
import {
  AnchorCoordinates,
  CreateShapeAnchorsData,
} from 'src/app/shared/create-shape-anchors-data.interface';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';
import { Shape } from 'src/app/enums/shape.enum';
import { SocketService } from 'src/app/services/socket/socket.service';

export class Path extends SvgObject {
  constructor(
    svgElement: HTMLElement,
    propertiesService: PropertiesService,
    createShapeAnchorsEventEmitter: Subject<CreateShapeAnchorsData>,
    endShapeDragEventEmitter: Subject<{ id: string; transform: string }>,
    socketService: SocketService
  ) {
    super(
      svgElement,
      propertiesService,
      createShapeAnchorsEventEmitter,
      endShapeDragEventEmitter,
      socketService
    );
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
    const transform = this.svgElement.getAttribute('transform')!;

    return {
      id,
      shapeType: Shape.PATH,
      stroke,
      'stroke-width': strokeWidth,
      fill,
      'fill-opacity': fillOpacity,
      transform,
    };
  }

  override updateProperties(properties: SvgElementProperties): void {
    if (this.canUserEdit) {
      this.svgElement.setAttribute('stroke', properties.stroke!);
      this.svgElement.setAttribute('stroke-width', properties['stroke-width']!);
      this.svgElement.setAttribute('fill', properties.fill!);
      this.svgElement.setAttribute('fill-opacity', properties['fill-opacity']!);
    }
  }
}
