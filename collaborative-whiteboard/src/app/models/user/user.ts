import { UserRole } from 'src/app/enums/user-role.enum';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
