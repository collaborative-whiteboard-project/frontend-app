import { Injectable } from '@angular/core';
import { Shape } from '../../enums/shape.enum';
import { v4 as uuidv4 } from 'uuid';

const defaultRectAttributes = {
  x: '100',
  y: '100',
  height: '100',
  width: '200',
  stroke: 'black',
  'stroke-width': '1',
  fill: 'white',
};

const defaultCircleAttributes = {
  cx: '100',
  cy: '100',
  r: '50',
  stroke: 'black',
  'stroke-width': '1',
  fill: 'white',
};

@Injectable({ providedIn: 'root' })
export class ShapeCreationService {
  count = 0;
  svgNamespace = 'http://www.w3.org/2000/svg';

  createShape(shape: Shape, document: Document): HTMLElement | void {
    if (shape === Shape.CIRCLE) {
      return this.createCircle(document);
    } else if (shape === Shape.RECTANGLE) {
      return this.createRectangle(document);
    }
  }

  createRectangle(document: Document): HTMLElement {
    const newRectangleElement = <HTMLElement>(
      document.createElementNS(this.svgNamespace, 'rect')
    );
    newRectangleElement.setAttributeNS(null, 'id', uuidv4());

    Object.entries(defaultRectAttributes).map(([key, value]) => {
      newRectangleElement.setAttributeNS(null, key, value);
    });

    return newRectangleElement;
  }

  createCircle(document: Document) {
    const newRectangleElement = <HTMLElement>(
      document.createElementNS(this.svgNamespace, 'circle')
    );
    newRectangleElement.setAttributeNS(null, 'id', uuidv4());

    Object.entries(defaultCircleAttributes).map(([key, value]) => {
      newRectangleElement.setAttributeNS(null, key, value);
    });

    return newRectangleElement;
  }
}
