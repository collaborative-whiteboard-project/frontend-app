import { Member } from './member';

export interface Project {
  id: number;
  name: string;
  members: Member[];
}
