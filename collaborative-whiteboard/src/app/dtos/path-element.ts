import { WhiteboardElement } from './whiteboard-element';

export interface PathElement extends WhiteboardElement {
  path: string;
  'fill-color': string;
  'stroke-width': string;
  'stroke-color': string;
  'fill-opacity': string;
}
