import { WhiteboardElement } from './whiteboard-element';

export interface LineElement extends WhiteboardElement {
  'x1-position': string;
  'y1-position': string;
  'x2-position': string;
  'y2-position': string;
  'stroke-width': string;
  'stroke-color': string;
}
