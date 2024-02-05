import { WhiteboardElement } from './whiteboard-element';

export interface TextElement extends WhiteboardElement {
  'x-position': string;
  'y-position': string;
  text: string;
  'font-size': string;
}
