import { WhiteboardElement } from './whiteboard-element';
import { WhiteboardOperation } from './whiteboard-operation.dto';

export class CreateElementOperation extends WhiteboardOperation {
  element: WhiteboardElement;
  constructor(projectId: string, timestamp: Date, element: WhiteboardElement) {
    super(projectId, timestamp);
    this.element = element;
  }
}
