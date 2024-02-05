import { WhiteboardOperation } from './whiteboard-operation.dto';

export class UpdateElmentOperation extends WhiteboardOperation {
  id: string;
  'property-name': string;
  'property-value': string;

  constructor(
    projectId: string,
    timestamp: Date,
    id: string,
    propertyName: string,
    propertyValue: string
  ) {
    super(projectId, timestamp);
    this.id = id;
    this['property-name'] = propertyName;
    this['property-value'] = propertyValue;
  }
}
