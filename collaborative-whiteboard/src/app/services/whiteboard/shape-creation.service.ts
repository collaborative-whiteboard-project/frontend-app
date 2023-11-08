import { Injectable } from '@angular/core';
import { Shape } from '../../enums/shape.enum';
import { v4 as uuidv4 } from 'uuid';

const defaultAttributes: { [key: string]: any } = {
  [Shape.RECTANGLE]: {
    x: '100',
    y: '100',
    height: '100',
    width: '200',
    stroke: 'black',
    'stroke-width': '1',
    fill: 'white',
  },
  [Shape.CIRCLE]: {
    cx: '100',
    cy: '100',
    r: '50',
    stroke: 'black',
    'stroke-width': '1',
    fill: 'white',
  },
  [Shape.PATH]: {
    stroke: 'black',
    'stroke-width': '3',
    fill: 'transparent',
  },
};

@Injectable({ providedIn: 'root' })
export class ShapeCreationService {
  svgNamespace = 'http://www.w3.org/2000/svg';

  createShape(
    shape: Shape,
    document: Document,
    d?: string
  ): HTMLElement | void {
    let shapeName: string;
    if (shape === Shape.CIRCLE) {
      shapeName = 'circle';
    } else if (shape === Shape.RECTANGLE) {
      shapeName = 'rect';
    } else if (shape === Shape.PATH) {
      shapeName = 'path';
    } else {
      return;
    }

    const newElement = <HTMLElement>(
      document.createElementNS(this.svgNamespace, shapeName)
    );
    newElement.setAttributeNS(null, 'id', uuidv4());

    Object.entries(defaultAttributes[shape]).map(([key, value]) => {
      newElement.setAttributeNS(null, key, value as string);
    });

    if (shape === Shape.PATH && !!d) {
      newElement.setAttributeNS(null, 'd', d);
    }

    return newElement;
  }

  createDrawingSurface(width: string, height: string, document: Document) {
    const drawingSurface = <HTMLElement>(
      document.createElementNS(this.svgNamespace, 'rect')
    );
    drawingSurface.setAttributeNS(null, 'id', 'drawing-surface');
    drawingSurface.setAttributeNS(null, 'x', '0');
    drawingSurface.setAttributeNS(null, 'x', '0');
    drawingSurface.setAttributeNS(null, 'width', width);
    drawingSurface.setAttributeNS(null, 'height', height);
    drawingSurface.setAttributeNS(null, 'fill', 'transparent');

    return drawingSurface;
  }
}
