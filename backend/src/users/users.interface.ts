import { Permission } from 'src/permissions/schemas/permission.schema';
import { Role } from 'src/roles/schemas/Role.schema';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
}
