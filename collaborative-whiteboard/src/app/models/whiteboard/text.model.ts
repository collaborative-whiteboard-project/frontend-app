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

export class Text extends SvgObject {
  override setAnchors(anchors: HTMLElement[]): void {}
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
    svgElement.setAttributeNS(null, 'cursor', 'default');
    svgElement.setAttributeNS(null, 'padding', '10px');
  }

  override getAnchors(): HTMLElement[] {
    return [];
  }

  override getAnchorsCoordinates(): AnchorCoordinates[] {
    return [];
  }

  override getProperties(): SvgElementProperties {
    const id = this.svgElement.getAttribute('id')!;
    const x = this.svgElement.getAttribute('x')!;
    const y = this.svgElement.getAttribute('y')!;
    const text = this.svgElement.innerHTML;
    const fontSize = this.svgElement.getAttribute('font-size')!;
    const transform = this.svgElement.getAttribute('transform')!;

    return {
      id,
      shapeType: Shape.TEXT,
      x: `${+x + this.translateX}`,
      y: `${+y + this.translateY}`,
      text,
      'font-size': fontSize,
      transform,
    };
  }

  override updateProperties(properties: SvgElementProperties): void {
    if (this.canUserEdit) {
      const x = +this.svgElement.getAttribute('x')!;
      const y = +this.svgElement.getAttribute('y')!;
      this.translateX = +properties.x! - x;
      this.translateY = +properties.y! - y;
      this.svgElement.setAttribute(
        'transform',
        `translate(${this.translateX}, ${this.translateY})`
      );
      this.svgElement.innerHTML = properties.text!;
      this.svgElement.setAttribute('font-size', properties['font-size']!);
    }
  }
}
