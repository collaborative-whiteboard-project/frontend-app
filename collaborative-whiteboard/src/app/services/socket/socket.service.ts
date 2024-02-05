import { Injectable } from '@angular/core';
import { AuthSerivce } from '../auth/auth.service';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { RectangleElement } from 'src/app/dtos/rectangle-element';
import { WhiteboardElement } from 'src/app/dtos/whiteboard-element';
import { WhiteboardOperation } from 'src/app/dtos/whiteboard-operation.dto';
import { DeleteElementOperation } from 'src/app/dtos/delete-element-operation.dto';
import { UpdateElmentOperation } from 'src/app/dtos/update-element-operation.dto';
import { CreateElementOperation } from 'src/app/dtos/create-element-operation';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socketClient: io.Socket | null = null;
  projectId: string | null = null;

  constructor(private authService: AuthSerivce) {
    this.socketClient = io.io('http://localhost:8085');
  }

  joinProject(projectId: string) {
    const jwt = this.authService.getToken()!;
    this.projectId = projectId;
    this.socketClient?.emit('joinProject', { projectId, jwtToken: jwt });
  }

  leaveProject(projectId: string) {
    const jwt = this.authService.getToken();
    this.projectId = null;
    this.socketClient?.emit('leaveProject', { projectId, jwtToken: jwt });
  }

  listenToProjectContentEvent(): Observable<{
    projectId: string;
    elements: [WhiteboardElement];
    modifiedAt: Date;
  }> {
    return fromEvent(this.socketClient!, 'projectContent');
  }

  listenToLatestChangesEvent(): Observable<WhiteboardOperation[]> {
    return fromEvent(this.socketClient!, 'latestChanges');
  }

  listenToConnectedMembers(): Observable<
    { memberEmail: string; memberRole: string }[]
  > {
    return fromEvent(this.socketClient!, 'projectMembers');
  }

  listenToCreateElement(): Observable<CreateElementOperation> {
    return fromEvent(this.socketClient!, 'createElement');
  }

  listenToUpdateElement(): Observable<UpdateElmentOperation> {
    return fromEvent(this.socketClient!, 'updateElement');
  }

  listenToDeleteElement(): Observable<DeleteElementOperation> {
    return fromEvent(this.socketClient!, 'deleteElement');
  }

  createWhiteboardElement(projectId: string, element: WhiteboardElement) {
    this.socketClient?.emit('createWhiteboardElement', {
      'project-id': projectId,
      element,
      timestamp: new Date(),
    });
  }

  updateWhiteboardElement(
    elementId: string,
    propertyName: string,
    propertyValue: string
  ) {
    const updateOp: UpdateElmentOperation = {
      'project-id': this.projectId!,
      'property-name': propertyName,
      'property-value': propertyValue,
      id: elementId,
      timestamp: new Date(),
    };
    return this.socketClient?.emit('updateWhiteboardElement', updateOp);
  }

  deleteWhiteboardElement(projectId: string, elementId: string) {
    const deleteOp: DeleteElementOperation = {
      'project-id': projectId,
      timestamp: new Date(),
      id: elementId,
    };
    this.socketClient?.emit('deleteWhiteboardElement', deleteOp);
  }
}
