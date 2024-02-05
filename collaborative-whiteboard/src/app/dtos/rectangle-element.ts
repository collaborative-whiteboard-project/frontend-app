import { WhiteboardElement } from './whiteboard-element';

export interface RectangleElement extends WhiteboardElement {
  'x-position': string;
  'y-position': string;
  width: string;
  height: string;
  'fill-color': string;
  'stroke-width': string;
  'stroke-color': string;
  'fill-opacity': string;
}
