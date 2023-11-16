import { Shape } from '../enums/shape.enum';

export interface SvgElementProperties {
  id: string;
  shapeType: Shape;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  r?: string;
  stroke?: string;
  'stroke-width'?: string;
  fill?: string;
  'fill-opacity'?: string;
  text?: string;
  'font-size'?: string;
}
