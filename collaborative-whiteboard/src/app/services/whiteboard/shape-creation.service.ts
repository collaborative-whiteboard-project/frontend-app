import { Injectable } from '@angular/core';
import { Shape } from '../../enums/shape.enum';
import { v4 as uuidv4 } from 'uuid';
import { AnchorCoordinates } from 'src/app/shared/create-shape-anchors-data.interface';
import { RectangleElement } from 'src/app/dtos/rectangle-element';
import { WhiteboardElement } from 'src/app/dtos/whiteboard-element';
import { CircleElement } from 'src/app/dtos/circle-element';
import { LineElement } from 'src/app/dtos/line-element';
import { PathElement } from 'src/app/dtos/path-element';
import { TextElement } from 'src/app/dtos/text-element';

const defaultAttributes: { [key: string]: any } = {
  [Shape.RECTANGLE]: {
    x: '100',
    y: '100',
    height: '100',
    width: '200',
    stroke: '#000000',
    'stroke-width': '2',
    fill: '#FFFFFF',
    'fill-opacity': '1',
  },
  [Shape.CIRCLE]: {
    cx: '100',
    cy: '100',
    r: '50',
    stroke: '#000000',
    'stroke-width': '2',
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
  [Shape.LINE]: {
    x1: '100',
    y1: '200',
    x2: '200',
    y2: '100',
    stroke: '#000000',
    'stroke-width': '2',
  },
};

@Injectable({ providedIn: 'root' })
export class ShapeCreationService {
  svgNamespace = 'http://www.w3.org/2000/svg';

  createShape(
    shape: Shape,
    document: Document,
    d?: string
  ): [HTMLElement, WhiteboardElement] | [HTMLElement, null] | void {
    let elementDto: WhiteboardElement;
    let shapeName: string;
    if (shape === Shape.CIRCLE) {
      shapeName = 'circle';
    } else if (shape === Shape.RECTANGLE) {
      shapeName = 'rect';
    } else if (shape === Shape.PATH) {
      shapeName = 'path';
    } else if (shape === Shape.TEXT) {
      shapeName = 'text';
    } else if (shape === Shape.LINE) {
      shapeName = 'line';
    } else {
      return;
    }

    const dto = this.createElementDto(shape, d);
    const id = uuidv4();

    const newElement = <HTMLElement>(
      document.createElementNS(this.svgNamespace, shapeName)
    );
    newElement.setAttributeNS(null, 'id', id);

    Object.entries(defaultAttributes[shape]).map(([key, value]) => {
      newElement.setAttributeNS(null, key, value as string);
    });

    if (shape === Shape.PATH && !!d) {
      newElement.setAttributeNS(null, 'd', d);
    }

    if (shape == Shape.TEXT) {
      newElement.innerHTML = 'New text';
    }

    if (!!dto) {
      dto.id = id;
      elementDto = dto;
      return [newElement, elementDto];
    }

    return [newElement, null];
  }

  createShapeFromExternalData(element: WhiteboardElement, document: Document) {
    const shapeType = element['element-type'];
    let shapeName = '';
    switch (shapeType) {
      case 'RECTANGLE':
        shapeName = 'rect';
        break;
      case 'CIRCLE':
        shapeName = 'circle';
        break;
      case 'LINE':
        shapeName = 'line';
        break;
      case 'PATH':
        shapeName = 'path';
        break;
      case 'TEXT':
        shapeName = 'text';
        break;
      default:
        return null;
    }

    const newElement = <HTMLElement>(
      document.createElementNS(this.svgNamespace, shapeName)
    );

    newElement.setAttributeNS(null, 'id', element.id);
    newElement.setAttributeNS(null, 'transform', element.transform);

    if (shapeType === 'RECTANGLE') {
      const rect = element as RectangleElement;
      newElement.setAttributeNS(null, 'x', rect['x-position']);
      newElement.setAttributeNS(null, 'y', rect['y-position']);
      newElement.setAttributeNS(null, 'height', rect.height);
      newElement.setAttributeNS(null, 'width', rect.width);
      newElement.setAttributeNS(null, 'stroke', rect['stroke-color']);
      newElement.setAttributeNS(null, 'stroke-width', rect['stroke-width']);
      newElement.setAttributeNS(null, 'fill', rect['fill-color']);
      newElement.setAttributeNS(null, 'fill-opacity', rect['fill-opacity']);
    } else if (shapeType === 'CIRCLE') {
      const circle = element as CircleElement;
      newElement.setAttributeNS(null, 'cx', circle['x-position']);
      newElement.setAttributeNS(null, 'cy', circle['y-position']);
      newElement.setAttributeNS(null, 'r', circle.radius);
      newElement.setAttributeNS(null, 'stroke', circle['stroke-color']);
      newElement.setAttributeNS(null, 'stroke-width', circle['stroke-width']);
      newElement.setAttributeNS(null, 'fill', circle['fill-color']);
      newElement.setAttributeNS(null, 'fill-opacity', circle['fill-opacity']);
    } else if (shapeType === 'PATH') {
      const path = element as PathElement;
      newElement.setAttributeNS(null, 'd', path.path);
      newElement.setAttributeNS(null, 'stroke', path['stroke-color']);
      newElement.setAttributeNS(null, 'stroke-width', path['stroke-width']);
      newElement.setAttributeNS(null, 'fill-color', path['fill-color']);
      newElement.setAttributeNS(null, 'fill-opacity', path['fill-opacity']);
    } else if (shapeType === 'TEXT') {
      const text = element as TextElement;
      newElement.setAttributeNS(null, 'x', text['x-position']);
      newElement.setAttributeNS(null, 'y', text['y-position']);
      newElement.setAttributeNS(null, 'font-size', text['font-size']);
      newElement.innerHTML = text.text;
    } else if (shapeType === 'LINE') {
      const line = element as LineElement;
      newElement.setAttributeNS(null, 'x1', line['x1-position']);
      newElement.setAttributeNS(null, 'y1', line['y1-position']);
      newElement.setAttributeNS(null, 'x2', line['x2-position']);
      newElement.setAttributeNS(null, 'y2', line['y2-position']);
      newElement.setAttributeNS(null, 'stroke', line['stroke-color']);
      newElement.setAttributeNS(null, 'stroke-width', line['stroke-width']);
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
      anchor.setAttributeNS(null, 'width', '20');
      anchor.setAttributeNS(null, 'height', '20');
      anchor.setAttributeNS(null, 'stroke-width', '1');
      anchor.setAttributeNS(null, 'stroke', '#000000');
      anchor.setAttributeNS(null, 'fill', 'transparent');
      anchor.setAttributeNS(null, 'transform', 'translate(0, 0)');
      anchor.setAttributeNS(null, 'rx', '3');

      return <HTMLElement>anchor;
    });

    return anchors;
  }

  createWrapperLine(document: Document) {
    const wrapperLine = this.createShape(Shape.LINE, document);
    if (!!wrapperLine) {
      wrapperLine[0].setAttribute('stroke-width', '40');
      wrapperLine[0].setAttribute('stroke', 'transparent');
    }
    return wrapperLine;
  }

  createElementDto(shape: Shape, d?: string): WhiteboardElement | undefined {
    const attributes = defaultAttributes[shape];
    const transform = 'translate(0, 0)';
    switch (shape) {
      case Shape.RECTANGLE:
        const rectangleDto: RectangleElement = {
          id: '',
          'element-type': 'RECTANGLE',
          'fill-color': attributes.fill,
          'fill-opacity': attributes['fill-opacity'],
          'stroke-color': attributes.stroke,
          'stroke-width': attributes['stroke-width'],
          'x-position': attributes.x,
          'y-position': attributes.y,
          height: attributes.height,
          width: attributes.width,
          transform: transform,
        };
        return rectangleDto;
        break;
      case Shape.CIRCLE:
        const circleDto: CircleElement = {
          id: '',
          'element-type': 'CIRCLE',
          'x-position': attributes.cx,
          'y-position': attributes.cy,
          radius: attributes.r,
          'stroke-color': attributes.stroke,
          'stroke-width': attributes['stroke-width'],
          'fill-color': attributes.fill,
          'fill-opacity': attributes['fill-opacity'],
          transform: transform,
        };
        return circleDto;
        break;
      case Shape.LINE:
        const lineDto: LineElement = {
          id: '',
          'element-type': 'LINE',
          'x1-position': attributes.x1,
          'y1-position': attributes.y1,
          'x2-position': attributes.x2,
          'y2-position': attributes.y2,
          'stroke-color': attributes.stroke,
          'stroke-width': attributes['stroke-width'],
          transform: transform,
        };
        return lineDto;
        break;
      case Shape.PATH:
        const pathDto: PathElement = {
          id: '',
          'element-type': 'PATH',
          'fill-color': attributes.fill,
          'fill-opacity': attributes['fill-opacity'],
          'stroke-color': attributes.stroke,
          'stroke-width': attributes['stroke-width'],
          path: d!,
          transform: transform,
        };
        return pathDto;
        break;
      case Shape.TEXT:
        const textDto: TextElement = {
          id: '',
          'element-type': 'TEXT',
          'font-size': attributes['font-size'],
          'x-position': attributes.x,
          'y-position': attributes.y,
          text: 'New text',
          transform: transform,
        };
        return textDto;
        break;
    }
    return;
  }
}
