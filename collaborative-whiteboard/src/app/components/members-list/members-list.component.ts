import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Member } from 'src/app/models/project/member';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent {
  @Input() members: Member[] = [];
  @Input() membersListVisible = false;
  @Output() membersListVisibleChange = new EventEmitter<boolean>();

  onCloseList() {
    this.membersListVisible = false;
    this.membersListVisibleChange.emit(this.membersListVisible);
  }
}
