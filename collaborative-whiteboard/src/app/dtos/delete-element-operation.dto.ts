import { WhiteboardOperation } from './whiteboard-operation.dto';

export class DeleteElementOperation extends WhiteboardOperation {
  id: string;
  constructor(projectId: string, timestamp: Date, id: string) {
    super(projectId, timestamp);
    this.id = id;
  }
}
