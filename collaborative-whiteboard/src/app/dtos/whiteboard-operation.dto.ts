export abstract class WhiteboardOperation {
  'project-id': string;
  timestamp: Date;

  constructor(projectId: string, timestamp: Date) {
    this['project-id'] = projectId;
    this.timestamp = timestamp;
  }
}
