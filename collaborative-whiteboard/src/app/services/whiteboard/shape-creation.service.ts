import { Injectable } from '@angular/core';
import { Shape } from '../../enums/shape.enum';
import { v4 as uuidv4 } from 'uuid';
import { AnchorCoordinates } from 'src/app/shared/create-shape-anchors-data.interface';

const defaultAttributes: { [key: string]: any } = {
  [Shape.RECTANGLE]: {
    x: '100',
    y: '100',
    height: '100',
    width: '200',
    stroke: '#000000',
    'stroke-width': '1',
    fill: '#FFFFFF',
    'fill-opacity': '1',
  },
  [Shape.CIRCLE]: {
    cx: '100',
    cy: '100',
    r: '50',
    stroke: '#000000',
    'stroke-width': '1',
    fill: '#FFFFFF',
    'fill-opacity': '1',
  },
  [Shape.PATH]: {
    stroke: '#000000',
    'stroke-width': '3',
    fill: '#FFFFFF',
    'fill-opacity': '0',
  },
  [Shape.TEXT]: {
    x: '100',
    y: '100',
    'font-size': '25',
    'fill-opacity': '1',
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
    } else if (shape === Shape.TEXT) {
      shapeName = 'text';
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

    if (shape == Shape.TEXT) {
      newElement.innerHTML = 'New text';
    }

    return newElement;
  }

  createDrawingSurface(width: string, height: string, document: Document) {
    const drawingSurface = <HTMLElement>(
      document.createElementNS(this.svgNamespace, 'rect')
    );
    drawingSurface.setAttributeNS(null, 'id', 'drawing-surface');
    drawingSurface.setAttributeNS(null, 'x', '0');
    drawingSurface.setAttributeNS(null, 'y', '0');
    drawingSurface.setAttributeNS(null, 'width', width);
    drawingSurface.setAttributeNS(null, 'height', height);
    drawingSurface.setAttributeNS(null, 'fill', 'transparent');

    return drawingSurface;
  }

  createElementAnchors(
    anchorCoordinates: AnchorCoordinates[],
    document: Document
  ): HTMLElement[] {
    const anchors = anchorCoordinates.map((coordinates) => {
      const anchor = document.createElementNS(this.svgNamespace, 'rect');
      anchor.setAttributeNS(null, 'x', coordinates.x.toString());
      anchor.setAttributeNS(null, 'y', coordinates.y.toString());
      anchor.setAttributeNS(null, 'width', '16');
      anchor.setAttributeNS(null, 'height', '16');
      anchor.setAttributeNS(null, 'stroke-width', '1');
      anchor.setAttributeNS(null, 'stroke', '#000000');
      anchor.setAttributeNS(null, 'fill', '#FFFFFF');
      anchor.setAttributeNS(null, 'transform', 'translate(0, 0)');
      return <HTMLElement>anchor;
    });

    return anchors;
  }
}
