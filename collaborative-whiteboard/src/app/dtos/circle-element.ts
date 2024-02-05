import { WhiteboardElement } from './whiteboard-element';

export interface CircleElement extends WhiteboardElement {
  'x-position': string;
  'y-position': string;
  radius: string;
  'fill-color': string;
  'stroke-width': string;
  'stroke-color': string;
  'fill-opacity': string;
}
